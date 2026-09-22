// Guardrail for the two independent sources of truth (see CLAUDE.md § Sources of Truth):
// flags fields whose nullability disagrees between prisma/schema.prisma and openapi.yml.
// Scope: only openapi schemas whose name exactly matches a prisma model/type name
// (e.g. `Area` <-> `model Area`) — Input/Result/WithoutId DTOs are intentionally partial
// (see pitfall #13) and are not compared.
import { readFileSync } from 'node:fs'
import { parse as parseYaml } from 'yaml'
import chalk from 'chalk'

type PrismaField = { nullable: boolean }
type PrismaBlocks = Record<string, Record<string, PrismaField>>
type OpenApiProp = Record<string, unknown>
type OpenApiSchemas = Record<string, Record<string, unknown>>

const FIELD_LINE = /^\s{2}(\w+)\s+(\w+)(\?)?(\[\])?(.*)$/

const parsePrismaBlocks = (source: string): PrismaBlocks => {
  const blocks: PrismaBlocks = {}
  const blockRegex = /^(?:model|type)\s+(\w+)\s*\{([\s\S]*?)\n\}/gm
  let match: RegExpExecArray | null
  while ((match = blockRegex.exec(source))) {
    const [, name, body] = match
    const fields: Record<string, PrismaField> = {}
    for (const line of body.split('\n')) {
      if (line.trim().startsWith('@@') || line.trim() === '' || line.trim().startsWith('//')) {
        continue
      }
      const fieldMatch = FIELD_LINE.exec(line)
      if (!fieldMatch) {
        continue
      }
      const [, fieldName, , optionalMark, arrayMark, rest] = fieldMatch
      const isRelation = rest.includes('@relation')
      const isArray = Boolean(arrayMark)
      if (isRelation || isArray) {
        continue
      }
      fields[fieldName] = { nullable: Boolean(optionalMark) }
    }
    blocks[name] = fields
  }
  return blocks
}

const flattenSchema = (schemaDef: Record<string, unknown>, schemas: OpenApiSchemas): Record<string, OpenApiProp> => {
  if (!schemaDef) {
    return {}
  }
  if (Array.isArray(schemaDef.allOf)) {
    return Object.assign({}, ...schemaDef.allOf.map(part => flattenSchema(part as Record<string, unknown>, schemas)))
  }
  if (typeof schemaDef.$ref === 'string') {
    const refName = schemaDef.$ref.replace('#/components/schemas/', '')
    return flattenSchema(schemas[refName], schemas)
  }
  return (schemaDef.properties as Record<string, OpenApiProp>) ?? {}
}

const isOpenApiNullable = (openapiProp: OpenApiProp): boolean => {
  if (openapiProp.nullable === true) {
    return true
  }
  const oneOf = openapiProp.oneOf
  return Array.isArray(oneOf) && oneOf.some(option => (option as Record<string, unknown>)?.type === 'null')
}

const isNullableMismatch = (prismaNullable: boolean, openapiProp: OpenApiProp): boolean =>
  prismaNullable !== isOpenApiNullable(openapiProp)

const main = () => {
  const prismaSource = readFileSync('prisma/schema.prisma', 'utf8')
  const openapiDoc = parseYaml(readFileSync('openapi.yml', 'utf8')) as { components: { schemas: OpenApiSchemas } }
  const prismaBlocks = parsePrismaBlocks(prismaSource)
  const schemas = openapiDoc.components.schemas

  const mismatches: string[] = []
  for (const [modelName, fields] of Object.entries(prismaBlocks)) {
    if (!schemas[modelName]) {
      continue
    }
    const openapiProps = flattenSchema(schemas[modelName], schemas)
    for (const [fieldName, { nullable }] of Object.entries(fields)) {
      const openapiProp = openapiProps[fieldName]
      if (!openapiProp) {
        continue
      }
      if (isNullableMismatch(nullable, openapiProp)) {
        mismatches.push(
          `${modelName}.${fieldName}: prisma ${nullable ? 'optional' : 'required'} vs openapi ${
            isOpenApiNullable(openapiProp) ? 'nullable' : 'non-nullable'
          }`
        )
      }
    }
  }

  if (mismatches.length > 0) {
    console.error(chalk.red(`schema-sync: ${mismatches.length} nullability mismatch(es) between prisma and openapi:`))
    for (const line of mismatches) {
      console.error(chalk.red(`  - ${line}`))
    }
    console.error(chalk.yellow('Fix the drifting side, or if intentional, extend the ignore list in this script.'))
    process.exit(1)
  }
  console.log(chalk.green('schema-sync: prisma and openapi nullability agree.'))
}

main()
