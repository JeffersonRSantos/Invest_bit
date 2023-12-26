import { ResponseDTO } from "../utils/DTOs/ResponseDTO"

export interface IRegisterUserRepository{
    register(props: any) : Promise<ResponseDTO>
}