import { NextFunction, Request, Response, Router } from "express"
import { Auth } from "../../core/middlewares/Auth";
import { loginUserAuthController } from "../useCase/LoginUserAuth";
import { depositController } from "../useCase/Deposit";
import { walletController } from "../useCase/Wallet";

const authRoutes = Router();

authRoutes.post('/_login', (req: Request, res: Response, next: NextFunction) => {
    return loginUserAuthController.login(req, res, next);
})

// Authenticated Routes

authRoutes.get('/_wallet/balance', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.getBalance(req, res, next)
})

authRoutes.get('/_wallet/btc/cotation', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.getCotation(req, res, next)
})

authRoutes.get('/_wallet/transactions', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.transactionVolumePerDay(req, res, next)
})

authRoutes.get('/_wallet/extract/:interval?', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.extract(req, res, next)
})

authRoutes.post('/_wallet/btc/purchase', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.purchaseBtc(req, res, next)
})

authRoutes.post('/_wallet/btc/sell', Auth, (req: Request, res: Response, next: NextFunction) => {
    return walletController.sellBtc(req, res, next)
})

authRoutes.post('/_deposit/new', Auth, (req: Request, res: Response, next: NextFunction) => {
    return depositController.newDeposit(req, res, next)
})

authRoutes.get('/_deposit/:deposit_id/details', Auth, (req: Request, res: Response, next: NextFunction) =>{
    return depositController.findDepositById(req, res, next)
})

export { authRoutes }