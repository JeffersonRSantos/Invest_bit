import { z } from 'zod'

const walletSellSchema = async (props: Object) => {
  const obj = z.object({
    value_btc: z.string().min(1).max(10)
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { walletSellSchema }