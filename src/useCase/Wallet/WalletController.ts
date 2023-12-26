import { NextFunction, Request, Response } from "express"
import { GetCotation, Wallet } from "../../entities/Wallet";
import { LogsProvider } from "../../repositories/implementations/LogsProvider";
import { walletSellSchema } from "../../schemas/WalletSellSchema";
import { PurchaseBTCUseCase } from "./PurchaseBTCUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetCotationUseCase } from "./GetCotationUseCase";
import { SellBTCUseCase } from "./SellBTCUseCase";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";
import { newDepositSchema } from "../../schemas/NewDepositSchema";
import { TransactionsVolumePerDayUseCase } from "./TransactionsVolumePerDayUseCase";
import { ExtractUseCase } from "./ExtractUseCase";
import { extractSchema } from "../../schemas/ExtractSchema";

export class WalletController{
    constructor(
        private purchaseBTCUseCase: PurchaseBTCUseCase,
        private getBalanceUseCase: GetBalanceUseCase,
        private getCotationUseCase: GetCotationUseCase,
        private sellBTCUseCase: SellBTCUseCase,
        private transactionVolumePerDayUseCase: TransactionsVolumePerDayUseCase,
        private extractUseCase: ExtractUseCase
    ){}

    async getBalance (req: Request, res: Response, next: NextFunction): Promise<Response>{

        try {            
            const wallet: Wallet = await this.getBalanceUseCase.execute(req.token);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: wallet}).saveLog();
            
            return res.json({response: wallet});
        } catch (error) {       
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
        }
    }

    async getCotation (req: Request, res: Response, next: NextFunction): Promise<Response>{

        try {
            const cotation: GetCotation = await this.getCotationUseCase.execute();
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: cotation}).saveLog();

            return res.json({response: cotation})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
        }
    }

    async purchaseBtc (req: Request, res: Response, next: NextFunction): Promise<Response> {

        const validateSchema = await newDepositSchema(req.body)

        if(!validateSchema.success){
            return res.status(401).json(validateSchema.error.issues);
        }

        const {value_brl} = req.body

        try {
            const buy: ResponseDTO = await this.purchaseBTCUseCase.execute(req.token, value_brl);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: buy}).saveLog();
            
            return res.json({response: buy})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
        }
    }

    async sellBtc (req: Request, res: Response, next: NextFunction): Promise<Response> {

        const validateSchema = await walletSellSchema(req.body)

        if(!validateSchema.success){
            return res.status(401).json(validateSchema.error.issues);
        }

        const {value_btc} = req.body

        try {
            const sell = await this.sellBTCUseCase.execute(req.token, value_btc);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: sell}).saveLog();

            return res.json({response: sell})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
        }
    }

    async transactionVolumePerDay (req: Request, res: Response, next: NextFunction): Promise<Response>{
        try {
            const transactionVolumePerDay =  await this.transactionVolumePerDayUseCase.execute()
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: transactionVolumePerDay}).saveLog();     
            return res.json({response: transactionVolumePerDay})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
            
        }
    }
    
    async extract (req: Request, res: Response, next: NextFunction): Promise<Response>{

        let interval: number = 90

        if(req.params.interval){
            const validateSchema = await extractSchema(req.params)
    
            if(!validateSchema.success){
                return res.status(401).json(validateSchema.error.issues);
            }

            interval = parseInt(req.params.interval)
        }      

        try {
            const extract = await this.extractUseCase.execute(req.token, interval);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: extract}).saveLog();
            return res.json({extract})
        } catch (error) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();
            throw new Error(`${error}`);
        }
    }
}