import { UserAuth } from "../entities/UserAuth";
import { GetCotation, Wallet } from "../entities/Wallet";
import { ResponseDTO } from "../utils/DTOs/ResponseDTO";

export interface IWalletRepository{
    getBalance(user: UserAuth): Promise<Wallet>
    getCotation(): Promise<GetCotation>
    purchaseBtc(user: UserAuth, value: string): Promise<ResponseDTO>
    sellBtc(user: UserAuth, value: string): Promise<ResponseDTO>
    transactionVolumePerDay(): Promise<Object>
    extract(user: UserAuth, interval: number): Promise<Object>
}