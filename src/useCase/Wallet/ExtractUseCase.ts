import { UserAuth } from "../../entities/UserAuth";
import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class ExtractUseCase{
    constructor(
        private walletProvider: WalletProvider
    ){}

    async execute (user: UserAuth, interval: number): Promise<Object> {
        return this.walletProvider.extract(user, interval)
    }
}