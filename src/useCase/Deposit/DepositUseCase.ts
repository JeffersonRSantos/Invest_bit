import { UserAuth } from "../../entities/UserAuth";
import { DepositProvider } from "../../repositories/implementations/DepositProvider";
import { DepositDTO } from "./DepositDTO";

export class DepositUseCase{
    constructor(
        private DepositProvider: DepositProvider
    ){}

    async execute(user: UserAuth, data: DepositDTO): Promise<Object>{
        return await this.DepositProvider.newDeposit(user, data)
    }
}