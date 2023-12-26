import { UserAuth } from "../../entities/UserAuth";
import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class SellBTCUseCase{
    constructor(
        private walletProvider: WalletProvider
    ){}

    async execute(user: UserAuth, value_btc: string){
        return this.walletProvider.sellBtc(user, value_btc)
    }
}