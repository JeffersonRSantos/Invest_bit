export const DepositMailTemplate = (value_brl: any) => {
    return `
        <div style="text-align:center;border:1px solid black;">
            <h3>Your deposit was successful</h3>
            <hr>
            <p style="font-size:14px;">Deposit BRL: ${value_brl}</p>
        </div>
    `
}

