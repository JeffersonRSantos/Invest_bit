import { z } from 'zod'

var regex = /^\s*\d{1,3}(?:\.\d{3})*,\d{2}$/

const newDepositSchema = async (props: Object) => {
  const obj = z.object({
    value_brl: z.string().min(1).refine(value => regex.test(value), {
      message: "Format currency invalid",
    })
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { newDepositSchema }