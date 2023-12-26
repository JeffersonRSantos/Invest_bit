import { NextFunction, Request, Response } from "express";
import { DepositUseCase } from "./DepositUseCase";
import { newDepositSchema } from "../../schemas/NewDepositSchema";
import { FindDepositByIdUseCase } from "./FindDepositByIdUseCase";
import { findDepositByIdSchema } from "../../schemas/FindDepositByIdSchema";
import { LogsProvider } from "../../repositories/implementations/LogsProvider";
import { FindTransactionById } from "../../entities/Deposit";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";

export class DepositController{
    constructor(
        private depositUseCase: DepositUseCase,
        private findDepositByIdUseCase: FindDepositByIdUseCase
    ){}

    async newDeposit (req: Request, res: Response, next: NextFunction): Promise<Response>{
        
        const validateSchema = await newDepositSchema(req.body)

        if(!validateSchema.success){
            return res.status(401).json(validateSchema.error.issues);
        }

        try {
            const depositUseCase: ResponseDTO = await this.depositUseCase.execute(req.token, req.body);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: depositUseCase}).saveLog();
            
            return res.json(depositUseCase)
        } catch (error: any) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            return res.status(500).json({errorMessage: error?.sqlMessage || error})            
        }
    }

    async findDepositById (req: Request, res: Response, next: NextFunction): Promise<Response>{
        try {
            const validateSchema = await findDepositByIdSchema(req.params)

            if(!validateSchema.success){
                return res.status(401).json(validateSchema.error.issues);
            }

            const findDepositUseCase: FindTransactionById = await this.findDepositByIdUseCase.execute(req.params.deposit_id);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: findDepositUseCase}).saveLog();

            return res.json({response: findDepositUseCase})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
        }
    }
}