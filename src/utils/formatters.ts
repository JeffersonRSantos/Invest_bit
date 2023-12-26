import { MercadoBitcoin } from "../services/TickerBTC/MercadoBitcoin"

export const currencyFormatterToBRL = (currency: any) => {
    return parseFloat(currency).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

export const currencyFormatter = (currency: any) => {
    return parseFloat(currency
    .replace(/[!R@#$%^&*. ]/g, '')
    .replace(',', '.'))
}

export const BRLinBTC = async (currency: any) => {
    let {ticker} = await new MercadoBitcoin().getTicker()
    return [parseFloat((parseFloat(currency) / parseFloat(ticker.buy)).toFixed(8)), parseFloat(ticker.buy)]
}

export const BTCinBRL = async (btc: any) => {
    let {ticker} = await new MercadoBitcoin().getTicker()
    return [parseFloat((parseFloat(btc) * parseFloat(ticker.buy)).toFixed(8)), parseFloat(ticker.buy)]
}