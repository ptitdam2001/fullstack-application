import { readFileSync } from 'node:fs'
import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'

type Operation = { requestBody?: unknown; responses?: Record<string, unknown> }
type Contract = { paths: Record<string, Record<string, Operation>> }

const METHODS = ['get', 'post', 'put', 'patch', 'delete']

// PUT /me/avatar has its own parser, which answers 400 to a body above its limit (see bodyLimits.ts).
const NO_PAYLOAD_TOO_LARGE = ['PUT /me/avatar']

const contract = parseYaml(readFileSync('./openapi.yml', 'utf8')) as Contract

const operationsWithBody = Object.entries(contract.paths).flatMap(([path, operations]) =>
  METHODS.filter(method => operations[method]?.requestBody !== undefined).map(method => ({
    name: `${method.toUpperCase()} ${path}`,
    statuses: Object.keys(operations[method].responses ?? {}),
  }))
)

// The body parser answers 400, 413 and 415 on any route that takes a body (issue #64):
// the contract must declare them, so that the generated SDK types them.
describe('openapi.yml — answers to an unreadable request body', () => {
  it('finds the operations that take a body', () => {
    expect(operationsWithBody.length).toBeGreaterThan(0)
  })

  it.each(operationsWithBody)('$name declares 400, 413 and 415', ({ name, statuses }) => {
    const expected = NO_PAYLOAD_TOO_LARGE.includes(name) ? ['400', '415'] : ['400', '413', '415']

    expect(statuses).toEqual(expect.arrayContaining(expected))
  })

  it.each(NO_PAYLOAD_TOO_LARGE)('%s declares no 413', name => {
    const operation = operationsWithBody.find(candidate => candidate.name === name)

    expect(operation?.statuses).not.toContain('413')
  })
})
