import { NextFunction, Request, Response, Router } from "express";
import { registerUserController } from "../useCase/RegisterUser";

const userRoutes = Router();

userRoutes.get('/', (req: Request, res: Response, next: NextFunction) => {    
    return res.status(200).send("Olá, seja bem vindo ao PaymentPic 😉")
})

userRoutes.post('/_register', (req: Request, res: Response, next: NextFunction) => {
    return registerUserController.register(req, res, next)
})

export { userRoutes }