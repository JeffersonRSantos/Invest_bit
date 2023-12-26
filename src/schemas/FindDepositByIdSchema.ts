import { z } from 'zod'

const findDepositByIdSchema = async (props: Object) => {
  const obj = z.object({
    deposit_id: z.string().min(36,{message: 'Format value invalid'}).max(36,{message: 'Format value invalid'}),
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { findDepositByIdSchema }