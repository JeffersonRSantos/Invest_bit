import { IRegisterUserRepository } from "../../repositories/IRegisterUserRepository";
import { RegisterUserDTO } from "./RegisterUserDTO";

export class RegisterUserUseCase{
    constructor(
        private registerUserRepository: IRegisterUserRepository
    ){}

    async execute(data: RegisterUserDTO){
        return await this.registerUserRepository.register(data)
    }
}