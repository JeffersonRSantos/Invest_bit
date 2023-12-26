export class Transaction{
    public value: any
    public transaction_id: any
    public transaction_status: number = 0
    public transaction_type: number = 0
    public btc_equivalent: any
    public btc_last_cotation: any
    public created_at: any
}

export class FindTransactionById{
    public transaction_id?: any
    public value?: any
    public date?: any
    public message?: string = ''
}