import { NextFunction, Request, Response } from "express";
import { registerUserSchema } from "../../schemas/RegisterUserSchema";
import { RegisterUserUseCase } from "./RegiterUserUseCase";
import { LogsProvider } from "../../repositories/implementations/LogsProvider";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";

export class RegisterUserController{
    constructor(
        private registerUserUseCase: RegisterUserUseCase
    ){}

    async register(req: Request, res: Response, next: NextFunction): Promise<Response>{

        try {            
            const validateSchema = await registerUserSchema(req.body)
    
            if(!validateSchema.success){
                return res.status(401).json({error: validateSchema.error.issues});
            }
    
            const register: ResponseDTO = await this.registerUserUseCase.execute(req.body);    
            new LogsProvider(201, req.path, req.method, {type: 'OUT', token: req.token, response: register}).saveLog()
    
            return res.status(201).json({response: register})

        } catch (error: any) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            return res.status(500).json({errorMessage: error?.sqlMessage || error})            
        }

    }
}