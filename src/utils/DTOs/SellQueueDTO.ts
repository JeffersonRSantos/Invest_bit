import { UserAuth } from "../../entities/UserAuth";
import { Wallet } from "../../entities/Wallet";

export class SellQueueDTO{
    public user: UserAuth | undefined
    public wallet: Wallet | undefined
    public value_btc: any
    public transaction_id: string = ''
}