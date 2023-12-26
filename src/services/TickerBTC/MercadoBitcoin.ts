import axios from "axios";

export class MercadoBitcoin{
    async getTicker(){
        try {
            const ticker = (await axios.get('https://www.mercadobitcoin.net/api/BTC/ticker/')).data
            return ticker
        } catch (error) {
            throw new Error(`Erro to connect API Ticker BTC`);            
        }
    }
}