import { UserAuth } from "../../entities/UserAuth";
import { Wallet } from "../../entities/Wallet";

export class PurchaseQueueDTO{
    public user: UserAuth | undefined
    public wallet: Wallet | undefined
    public formatterCurrency: any
    public transaction_id: string = ''
}