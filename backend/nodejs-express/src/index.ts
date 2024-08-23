
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import App from './config/server'

dotenv.config();

const port = process.env.PORT || 3000;

App.get('/', (_: Request, res: Response) => {
    res.status(200).json({ message: 'Express + typescript base route'})
})

App.listen(port, () => {
    console.log(`[Server express]: server is running on 'http://localhost:${port}/'`)
})