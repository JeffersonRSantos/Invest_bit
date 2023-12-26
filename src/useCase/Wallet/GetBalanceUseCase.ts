import { UserAuth } from "../../entities/UserAuth";
import { Wallet } from "../../entities/Wallet";
import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class GetBalanceUseCase{
    constructor(
        private walletProvider: WalletProvider
    ){}

    async execute(user: UserAuth): Promise<Wallet> {
        return this.walletProvider.getBalance(user)
    }
}