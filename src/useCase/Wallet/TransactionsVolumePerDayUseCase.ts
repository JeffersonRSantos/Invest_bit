import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class TransactionsVolumePerDayUseCase{
    constructor(
        private walletProvider: WalletProvider
    ){}

    async execute(): Promise<Object>{
        return this.walletProvider.transactionVolumePerDay()
    }
}