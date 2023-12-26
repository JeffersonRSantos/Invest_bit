import { UserAuth } from "../../entities/UserAuth"

export class MailDTO{
    public template: any
    public subject: string = ''
    public user: UserAuth | undefined
}