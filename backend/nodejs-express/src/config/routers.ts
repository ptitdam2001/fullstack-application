import type { Express } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { logger } from './logger';
import express from 'express'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getRoutersFromControllers(controllerPath: string) {
    const files = fs.readdirSync(controllerPath)
        .filter((filename) => fs.statSync(`${controllerPath}/${filename}`).isFile())
    
    return files.map(async (filename) => {
        const filePath = `${controllerPath}/${filename}`

        const { default: route } = await import(filePath)
        return {
            baseUrl: path.parse(filePath).name,
            router: route,
        }
    })
}

export const getControllers = async (basePath: string) => {
    const controllers = await getRoutersFromControllers(path.join(process.cwd(), 'src', 'controllers'))

    const subApp = express()
    controllers.forEach(async (elt) => {
        const { baseUrl, router} = await elt
        subApp.use(`${basePath}${baseUrl}`, router)
        logger.info(`Route: ${baseUrl} is loaded`)
    })
    return subApp
}