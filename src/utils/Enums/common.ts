export const statusTransactionEnum = {
    1: "Concluído",
    2: "Em processo",
    3: "Ocorreu um erro"
}

export const transactionTypes = {
    BUY: 1,
    SELL_PARTIAL: 2,
    SELL_FULL: 3,
    DEPOSIT: 4
}

export const transactionTypesNames = {
    1: 'Purchase',
    2: 'Sell Partial',
    3: 'Sell Full',
    4: 'Deposit'
}

export const statusTransation = {
    SUCCESS: 1,
    PROCCESSING: 2,
    ERROR: 3,
    CANCELED: 4,
    FININSHED: 5
}

export const methodSendMail = {
    MAIL: 1
}

export const methodSendMailName = {
    1: 'Mail'
}

export const Emum = (key: any, arr: any) => {
    return arr[key]
}