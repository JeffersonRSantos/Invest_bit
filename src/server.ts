import { WalletProvider } from "./repositories/implementations/WalletProvider"
import { knex } from "./services/Database/connection"
import { MailgunService } from "./services/Mail/MailgunService"
import { RabbitmqServer } from "./services/Queue/RabbitmqServer"
import { MailDTO } from "./utils/DTOs/MailDTO"
import { PurchaseQueueDTO } from "./utils/DTOs/PurchaseQueueDTO"
import { SellQueueDTO } from "./utils/DTOs/SellQueueDTO"
import { statusTransation } from "./utils/Enums/common"
import { app } from "./utils/app"
import { v4 as uuid } from "uuid";

require('dotenv').config()

app.listen( process.env.PORT_APP || 3444, async () => {
    const serverQueue = new RabbitmqServer(`${process.env.RABBITMQ_HOST}`)
    await serverQueue.start();
    await serverQueue.consumerQueue('MailNotification', (async (message) => {
        const {user, subject, template}: MailDTO = JSON.parse(message.content.toString());
        let isSuccess = false;

        if(user && subject && template){
            isSuccess = true;
            new MailgunService(user?.id, user?.email, subject, template).send();
        }

        const transaction_id: string = uuid();

        await knex("tb_queue_logs").insert({
            queue_id: transaction_id,
            status: (isSuccess ? statusTransation.SUCCESS : statusTransation.ERROR),
            payload: {user, queue: 'MailNotification', ...(isSuccess ? {response: {user, subject, template}} : {error: 'Unprocessed queue'})}
        });
    }))
    await serverQueue.consumerQueue('Purchase', (async (message) => {
        const {user, wallet, formatterCurrency, transaction_id}: PurchaseQueueDTO = JSON.parse(message.content.toString())
        let isSuccess = false

        if(user && wallet && formatterCurrency){
            isSuccess = true
            new WalletProvider().processPurchase(user, wallet, formatterCurrency, transaction_id)
        }

         await knex("tb_queue_logs").insert({
            queue_id: transaction_id,
            status: (isSuccess ? statusTransation.SUCCESS : statusTransation.ERROR),
            payload: {user, queue: 'Purchase', ...(isSuccess ? {response: {user, wallet, formatterCurrency, transaction_id}} : {error: 'Unprocessed queue'})}
        });
    }))
    await serverQueue.consumerQueue('Sell', (async (message) => {
        const {user, wallet, value_btc, transaction_id}: SellQueueDTO = JSON.parse(message.content.toString())
        let isSuccess = false

        if(user && wallet && value_btc && transaction_id){
            isSuccess = true
            new WalletProvider().processSell(user, wallet, value_btc, transaction_id)
        }
        
        await knex("tb_queue_logs").insert({
            queue_id: transaction_id,
            status: (isSuccess ? statusTransation.SUCCESS : statusTransation.ERROR),
            payload: {user, queue: 'Sell', ...(isSuccess ? {response: {user, wallet, value_btc, transaction_id}} : {error: 'Unprocessed queue'})}
        });
    }))
})