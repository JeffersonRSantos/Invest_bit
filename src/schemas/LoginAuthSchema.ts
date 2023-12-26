import { z } from 'zod'

const loginAuthSchema = async (props: Object) => {
  const obj = z.object({
    email: z.string().email({ message: "Email field, invalid format." }),
    password: z.string().min(6, { message: "Password field must contain at least 6 characters." })
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { loginAuthSchema }