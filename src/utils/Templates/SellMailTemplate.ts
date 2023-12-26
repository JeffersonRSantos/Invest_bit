export const SellMailTemplate = (value_brl: any, value_btc: any) => {
    return `
        <div style="text-align:center;border:1px solid black;">
            <h3>Your sell was successful</h3>
            <hr>
            <p style="font-size:14px;color:red">BTC Selled: ${value_btc}</p>
            <p style="font-size:14px;color:red">BRL Equivalent: ${value_brl}</p>
        </div>
    `
}

