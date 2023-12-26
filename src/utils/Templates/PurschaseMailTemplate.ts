export const PurschaseMailTemplate = (value_brl: any, value_btc: any) => {
    return `
        <div style="text-align:center;border:1px solid black;">
            <h3>Your purchase was successful</h3>
            <hr>
            <p style="font-size:14px;color:green">BRL: ${value_brl}</p>
            <p style="font-size:14px;color:green">BTC Equivalent: ${value_btc}</p>
        </div>
    `
}

