import { Channel, Connection, Message, connect } from "amqplib";

export class RabbitmqServer{
    private conn!: Connection;
    private channel!: Channel;

    constructor(private uri: string){}

    async start(): Promise<void>{
        this.conn = await connect(this.uri);
        this.channel = await this.conn.createChannel();
    }

    async publicInQueue(queue: string, message: string): Promise<boolean> {
        this.channel.assertQueue(queue)
        return this.channel.sendToQueue(queue, Buffer.from(message))
    }

    async consumerQueue(queue: string, callback: (message: Message) => void){
        this.channel.assertQueue(queue)
        return this.channel.consume(queue, (message: any) => {
            callback(message)
            this.channel.ack(message)
        })
    }
}