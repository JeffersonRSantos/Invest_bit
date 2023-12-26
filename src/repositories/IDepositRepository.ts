import { FindTransactionById } from "../entities/Deposit";
import { UserAuth } from "../entities/UserAuth";
import { ResponseDTO } from "../utils/DTOs/ResponseDTO";

export interface IDepositRepository{
    newDeposit(user: UserAuth, props: Object): Promise<ResponseDTO>
    findDepositById(props: Object): Promise<FindTransactionById>
}