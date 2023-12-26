import { IDepositRepository } from "../../repositories/IDepositRepository";

export class FindDepositByIdUseCase{
    constructor(
        private findDepositByIdProvider: IDepositRepository
    ){}

    async execute (Deposit_id: string): Promise<Object>{
        return await this.findDepositByIdProvider.findDepositById(Deposit_id)
    }
}