import { z } from 'zod'

const registerUserSchema = async (props: Object) => {
  const obj = z.object({
    name_full: z.string().min(4, { message: "The name field must contain at least 4 characters." }),
    email: z.string().email({ message: "Email field, invalid format." }),
    password: z.string().min(6, { message: "Password field must contain at least 6 characters." }),
  }).safeParse(props);

  if (!obj.success) {
    obj.error.issues;
  }

  return obj

}

export { registerUserSchema }