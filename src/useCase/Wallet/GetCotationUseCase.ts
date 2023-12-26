import { GetCotation } from "../../entities/Wallet";
import { WalletProvider } from "../../repositories/implementations/WalletProvider";

export class GetCotationUseCase{
    constructor(
        private walletProvider: WalletProvider
    ){}

    async execute(): Promise<GetCotation>{
        return this.walletProvider.getCotation()
    }
}