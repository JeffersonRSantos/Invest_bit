import { knex } from "../../services/Database/connection";
import { v4 as uuid } from 'uuid'

export class LogsProvider{
    public status: any
    public endpoint: string
    public method: string
    public payload: string

    constructor(status: any, endpoint: string, method:string, payload: any){
        this.status = status
        this.endpoint = endpoint
        this.method = method
        this.payload = payload
    }

    async saveLog(){
        const request_id: string = uuid()

        try {
            return await knex('tb_request_logs').insert({
                request_id,
                status: this.status, 
                endpoint: this.endpoint,
                method: this.method,
                payload: this.payload
            })
        } catch (error) {
            throw new Error(`Error to generate logs: ${error}`);
            
        }
    }
}