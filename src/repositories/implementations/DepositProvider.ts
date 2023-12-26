import { Transaction, FindTransactionById } from "../../entities/Deposit";
import { knex } from "../../services/Database/connection";
import { IDepositRepository } from "../IDepositRepository";
import { v4 as uuid } from 'uuid'
import { currencyFormatterToBRL, currencyFormatter } from "../../utils/formatters";
import { Wallet } from "../../entities/Wallet";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";
import { DepositMailTemplate } from "../../utils/Templates/DepositMailTemplate";
import { RabbitmqServer } from "../../services/Queue/RabbitmqServer";
import { UserAuth } from "../../entities/UserAuth";
import { statusTransation, transactionTypes } from "../../utils/Enums/common";

export class DepositProvider implements IDepositRepository {
    async newDeposit(user: UserAuth, props: any): Promise<ResponseDTO> {
        
        const {value_brl} = props
        const {id} = user

            return await knex.transaction(async (trx: any) => {

                let getWallet: Wallet = await trx.select().from('tb_wallet').where({user_id: id}).first()

                let currency = currencyFormatter(value_brl)
                
                if(!getWallet || !getWallet.user_id){
                    getWallet = await trx('tb_wallet').insert({user_id: id, balance_brl: currency})
                }else{
                    let sumBalance = (parseFloat(getWallet.balance_brl) + currency)
                    await trx('tb_wallet').where({user_id: id}).update({ balance_brl: sumBalance })
                }
        
                const transactionId: string = uuid()
                await trx('tb_transactions').insert({
                    transaction_id: transactionId,
                    value: currency,
                    user_id: id,
                    transaction_type: transactionTypes.DEPOSIT,
                    transaction_status: statusTransation.SUCCESS
                }).returning('id')

                const connQueue = new RabbitmqServer(`${process.env.RABBITMQ_HOST}`)
                await connQueue.start()
                await connQueue.publicInQueue('MailNotification', JSON.stringify({user, subject: 'Deposit made successfully', template: DepositMailTemplate(currencyFormatterToBRL((currency).toFixed(2)))}))
                await knex("tb_queue_logs").insert({
                    queue_id: transactionId,
                    status: statusTransation.PROCCESSING,
                    payload: {user, queue: 'MailNotification'}
                });

                return { message: "Deposit made successfully." }
            })
    }

    async findDepositById(transaction_id: string): Promise<FindTransactionById> {
        const transaction: Transaction = await knex('tb_transactions').where({transaction_id}).first()

        if(!transaction) return {message: "Transaction not found."}

        return {
            transaction_id: transaction.transaction_id,
            value: currencyFormatterToBRL(transaction.value),
            date: transaction.created_at
        }
    }
}