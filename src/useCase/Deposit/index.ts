import { DepositProvider } from "../../repositories/implementations/DepositProvider";
import { FindDepositByIdUseCase } from "./FindDepositByIdUseCase";
import { DepositController } from "./DepositController";
import { DepositUseCase } from "./DepositUseCase";

const depositProvider = new DepositProvider();

const depositUseCase = new DepositUseCase(
    depositProvider
)

const findDepositById = new FindDepositByIdUseCase(
    depositProvider
)

const depositController = new DepositController(
    depositUseCase,
    findDepositById
)

export { depositController }