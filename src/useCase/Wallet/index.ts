import { WalletProvider } from "../../repositories/implementations/WalletProvider"
import { PurchaseBTCUseCase } from "./PurchaseBTCUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetCotationUseCase } from "./GetCotationUseCase"
import { SellBTCUseCase } from "./SellBTCUseCase"
import { WalletController } from "./WalletController"
import { TransactionsVolumePerDayUseCase } from "./TransactionsVolumePerDayUseCase"
import { ExtractUseCase } from "./ExtractUseCase"

const walletProvider = new WalletProvider()

const purchaseBTCUseCase = new PurchaseBTCUseCase(walletProvider)
const getBalanceUseCase = new GetBalanceUseCase(walletProvider)
const getCotationUseCase = new GetCotationUseCase(walletProvider)
const sellBTCUseCase = new SellBTCUseCase(walletProvider)
const transactionVolumePerDay = new TransactionsVolumePerDayUseCase(walletProvider)
const extractUseCase = new ExtractUseCase(walletProvider)

const walletController = new WalletController(
    purchaseBTCUseCase,
    getBalanceUseCase,
    getCotationUseCase,
    sellBTCUseCase,
    transactionVolumePerDay,
    extractUseCase
)

export {walletController}