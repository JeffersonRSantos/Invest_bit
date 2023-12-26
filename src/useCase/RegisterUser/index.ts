import { RegisterUserProvider } from "../../repositories/implementations/RegisterUserProvider";
import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegiterUserUseCase";

const registerUserProvider = new RegisterUserProvider();

const registerUserCase = new RegisterUserUseCase(
    registerUserProvider
)

const registerUserController = new RegisterUserController(
    registerUserCase
)

export {registerUserController}