import { Router } from "express";

const router = Router();

router.get('/', (_, res) => {
    res.send({
        version: '1.0.0'
    })
})

router.get('/me', (_, res) => res.send({ message: 'Hello world'}))

export default router