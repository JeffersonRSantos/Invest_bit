import { createClient  } from 'redis'

export class RedisServer{
    private client: any

    constructor(){
        this.startConnection()
        console.log(this.client)
    }

    async startConnection(): Promise<void>{
        this.client = createClient({url: process.env.REDIS_HOST})
        await this.client.connect();
    }

    async get(key: string): Promise<any>{
        return await this.client.get(key);
    }

    async set(key: string, value: string, ex: number = 3600): Promise<void>{
        await this.client.set(key, value, {
            EX: ex,
            NX: true
        });
    }
}