export class UserAuth{
    public id?: string = ""
    public email?: string = ""
    public bearer_token?: string = ""
    public expires_in?: string = ""
    public message?: string = ""
    public error?: object
    public status: number = 200
}