import { UserAuth } from "../../entities/UserAuth";
import { GetCotation, Wallet } from "../../entities/Wallet";
import { knex } from "../../services/Database/connection";
import { RabbitmqServer } from "../../services/Queue/RabbitmqServer";
import { MercadoBitcoin } from "../../services/TickerBTC/MercadoBitcoin";
import { Emum, statusTransactionEnum, statusTransation, transactionTypes, transactionTypesNames } from "../../utils/Enums/common";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";
import { PurschaseMailTemplate } from "../../utils/Templates/PurschaseMailTemplate";
import {
  BRLinBTC,
  BTCinBRL,
  currencyFormatter,
  currencyFormatterToBRL,
} from "../../utils/formatters";
import { IWalletRepository } from "../IWalletProvider";
import { v4 as uuid } from "uuid";
import { Transaction } from "../../entities/Deposit";
import { RedisServer } from "../../services/Cache/RedisServer";

class WalletProvider implements IWalletRepository {

  private connQueue: any 
  constructor(){
    this.connQueue = new RabbitmqServer(`${process.env.RABBITMQ_HOST}`)
    this.connQueue.start()
  }

  async getBalance(user: UserAuth): Promise<Wallet> {
    const wallet: Wallet = await knex("tb_wallet")
      .select("balance_brl", "balance_btc")
      .where({ user_id: user.id })
      .first();    
      
    if(!wallet) return {balance_brl: "0", balance_btc: "0"};

    return {...wallet, balance_brl: currencyFormatterToBRL(wallet.balance_brl),
    };
  }

  async getCotation(): Promise<GetCotation> {
    const { ticker } = await new MercadoBitcoin().getTicker();
    return {
      buy: currencyFormatterToBRL(parseFloat(ticker.buy).toFixed(2)),
      sell: currencyFormatterToBRL(parseFloat(ticker.sell).toFixed(2)),
    };
  }

  async purchaseBtc(user: UserAuth, value_brl: string): Promise<ResponseDTO> {
    let user_id = user.id;
    const formatterCurrency = currencyFormatter(value_brl);
    const transaction_id: string = uuid();

    return await knex
      .transaction(async (trx: any) => {
        let wallet: Wallet = await knex("tb_wallet").where({ user_id }).first().transacting(trx);

        if(!wallet) return { status: 400, message: "Wallet not found." }

        let balanceBrl = parseFloat(wallet.balance_brl);

        if (balanceBrl && balanceBrl < formatterCurrency) return { status: 400, message: "Insufficient funds for buy." };

        await this.connQueue.publicInQueue('Purchase', JSON.stringify({user, wallet, formatterCurrency, transaction_id}))

        await knex("tb_queue_logs").insert({
          queue_id: transaction_id,
          status: statusTransation.PROCCESSING,
          payload: {user, queue: 'Purchase'}
        });

        return { message: "Purchase made successfully." }
  
      })
      .catch(async (error: any) => {
        await knex("tb_transactions").insert({
          transaction_id,
          value: formatterCurrency,
          user_id,
          transaction_status: statusTransation.ERROR,
          transaction_type: transactionTypes.BUY,
        });

        throw new Error(`Error to purchase BTC ${error}`);
        
      });
  }

  async sellBtc(user: UserAuth, value_btc: string): Promise<ResponseDTO> {
    let user_id = user.id;
    let value = parseFloat(value_btc);

    if (!(value > 0)) return { status: 400, message: "Invalid value BTC" };

    const transaction_id: string = uuid();

      return await knex.transaction(async (trx: any) => {
        let wallet: Wallet = await knex("tb_wallet").where({ user_id }).first().transacting(trx);

        if(!wallet) return { status: 400, message: "Wallet not found." }
        
        let balanceBtc = parseFloat(wallet.balance_btc);

        if (balanceBtc && value > balanceBtc) return { status: 400, message: "Insufficient BTC for sell" };

        await this.connQueue.publicInQueue('Sell', JSON.stringify({user, wallet, value_btc, transaction_id}))

        await knex("tb_queue_logs").insert({
          queue_id: transaction_id,
          status: statusTransation.PROCCESSING,
          payload: {user, queue: 'Sell'}
        });
        
        return {message: "Sell made successfully." };

      }).catch(async(error: any) => {
        await knex("tb_transactions").insert({
            transaction_id,
            user_id,
            value: 0,
            btc_equivalent: value,
            transaction_status: statusTransation.ERROR,
            transaction_type: transactionTypes.BUY,
        });

        throw new Error(`Error to sell BTC ${error}`);
      })
  }

  async processPurchase (user: UserAuth, wallet: Wallet, formatterCurrency: any, transaction_id: any): Promise<void> {
    let balanceBrl = parseFloat(wallet.balance_brl);
    let balanceBtc = parseFloat(wallet.balance_btc);
    let {id} = user

    let [btc_equivalent, btc_last_cotation]: any = await BRLinBTC(formatterCurrency);
    let updateBalanceBrl: any = balanceBrl - formatterCurrency;
    let updateBalanceBtc: any = balanceBtc + btc_equivalent;

    await knex.transaction(async (trx: any): Promise<void> => {
        await knex("tb_transactions")
          .insert({
            transaction_id,
            value: formatterCurrency,
            user_id: id,
            btc_equivalent,
            btc_last_cotation,
            transaction_status: statusTransation.SUCCESS,
            transaction_type: transactionTypes.BUY,
          })
          .transacting(trx);
    
        await knex("tb_wallet")
          .where({ user_id: id })
          .update({
            balance_brl: updateBalanceBrl,
            balance_btc: updateBalanceBtc,
          })
          .transacting(trx);
    
        await this.connQueue.publicInQueue('MailNotification', JSON.stringify({user, subject: 'Purchase made successfully', template: PurschaseMailTemplate(currencyFormatterToBRL(formatterCurrency), btc_equivalent)}))
        
        await knex("tb_queue_logs").insert({
          queue_id: transaction_id,
          status: statusTransation.PROCCESSING,
          payload: {user, queue: 'MailNotification'}
        }).transacting(trx);

      }).catch(async(error: any) => {
        await knex("tb_queue_logs").insert({
            queue_id: transaction_id,
            status: 3,
            patload: {queue: 'processPurchase', data: {value_brl: formatterCurrency}, error}
        });
    })
  }

  async processSell (user: UserAuth, wallet: Wallet, value_btc: any, transaction_id: any): Promise<void>{
      let balanceBrl = parseFloat(wallet.balance_brl);
      let balanceBtc = parseFloat(wallet.balance_btc);
      let {id} = user

      let [brl_equivalent, btc_last_cotation]: any = await BTCinBRL(value_btc);
      let updateBalanceBrl: any = balanceBrl + brl_equivalent;
      let updateBalanceBtc: any = balanceBtc - value_btc;

      return await knex.transaction(async (trx: any) => {
        await knex("tb_transactions")
          .insert({
            transaction_id,
            value: brl_equivalent,
            user_id: id,
            btc_equivalent: value_btc,
            btc_last_cotation,
            transaction_status: statusTransation.SUCCESS,
            transaction_type:
              value_btc === balanceBtc
                ? transactionTypes.BUY
                : transactionTypes.SELL_PARTIAL,
          })
          .transacting(trx);

        await knex("tb_wallet")
          .where({ user_id: id })
          .update({
            balance_brl: updateBalanceBrl,
            balance_btc: updateBalanceBtc,
          })
          .transacting(trx);

        await this.connQueue.publicInQueue('MailNotification', JSON.stringify({user, subject: 'Sell made successfully', template: PurschaseMailTemplate(currencyFormatterToBRL((brl_equivalent).toFixed(2)), value_btc)}))
        
        await knex("tb_queue_logs").insert({
          queue_id: transaction_id,
          status: statusTransation.PROCCESSING,
          payload: {user, queue: 'MailNotification'}
        });

      }).catch(async(error: any) => {        
        await knex("tb_queue_logs").insert({
            queue_id: transaction_id,
            status: 3,
            payload: {queue: 'processSell', data: {value_btc}, error}
        });
    })
  }

  async transactionVolumePerDay(): Promise<Object>{
    let date = new Date()
    return await knex.transaction(async (trx: any) => {
      const [transactionsPurchase] = await knex('tb_transactions').select(knex.raw('SUM(value) as value, SUM(btc_equivalent) as btc_equivalent')).where('transaction_type', transactionTypes.BUY).where('created_at', 'like', `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}%`).transacting(trx)
      const [transactionsSell] = await knex('tb_transactions').select(knex.raw('SUM(value) as value, SUM(btc_equivalent) as btc_equivalent')).where('transaction_type', transactionTypes.SELL_FULL).orWhere('transaction_type', transactionTypes.SELL_PARTIAL).where('created_at', 'like', `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}%`).transacting(trx)
      
      return {...transactionsPurchase.length > 0 ? {purchased: {
            volume_brl: currencyFormatterToBRL(transactionsPurchase.value),
            volume_btc: transactionsPurchase.btc_equivalent
        }}: {}, ...(transactionsSell.length > 0 ? {selled: { 
            volume_brl: currencyFormatterToBRL(transactionsSell.value),
            volune_btc: transactionsSell.btc_equivalent
          }}: {})
      }

    })
  }

  async extract(user: UserAuth, interval: number) : Promise<Object>{

      const redisClient = new RedisServer()

      const getInCache: string = await redisClient.get(`extract_${user.id}_${interval}`)

      if(getInCache) return {transactions: JSON.parse(getInCache)}

      let transactions: Transaction[] = await knex('tb_transactions')
        .where('user_id', user.id)
        .where(knex.raw(`created_at BETWEEN NOW() - INTERVAL ${interval} DAY AND NOW()`))
      
      if(transactions.length === 0) return {transactions: []}

      let formatter: any = []
      transactions.map((item: Transaction) => {
        let date = new Date(item.created_at)

        formatter.push({
          type: Emum(item.transaction_type, transactionTypesNames),
          status: Emum(item.transaction_status, statusTransactionEnum),
          value_brl: currencyFormatterToBRL(item.value),
          ...(item.transaction_type !== 4) ?  {
            btc_equivalent: item.btc_equivalent,
            btc_last_cotation: currencyFormatterToBRL(item.btc_last_cotation),
          } : {},
          date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
        })
      })

      if(formatter.length > 0) await redisClient.set(`extract_${user.id}_${interval}`, JSON.stringify(formatter), 43200)

      return {transactions: formatter}

  }
}

export { WalletProvider };
