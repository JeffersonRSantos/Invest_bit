import { UserAuth } from "../../entities/UserAuth";
import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class PurchaseBTCUseCase{
    constructor(
        private walletProvider: WalletProvider 
    ){}

    async execute(user: UserAuth, value_brl: string){
        return this.walletProvider.purchaseBtc(user, value_brl)
    }
}