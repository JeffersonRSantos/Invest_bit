import { z } from 'zod'

const extractSchema = async (props: Object) => {
  const obj = z.object({
    interval: z.string().min(1,{message: 'Format value invalid'}).refine(value => parseInt(value) <= 90, {
      message: 'Value invalid, max interval of 90 days.'
    }),
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { extractSchema }