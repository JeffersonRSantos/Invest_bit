import { UserAuthProvider } from "../../repositories/implementations/UserAuthProvider"
import { LoginUserAuthController } from "./LoginUserAuthController"
import { LoginUserAuthUseCase } from "./LoginUserAuthUseCase"

const userAuthProvider = new UserAuthProvider();

const loginUserAuthUseCase = new LoginUserAuthUseCase(
    userAuthProvider
)

const loginUserAuthController = new LoginUserAuthController(
    loginUserAuthUseCase
)

export { loginUserAuthController }