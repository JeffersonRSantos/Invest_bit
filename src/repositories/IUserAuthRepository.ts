import { UserAuth } from "../entities/UserAuth";

/**
 * Repositories
 * 
 * Responsáveis por guardar todos os métodos que seram usados 
 * pelo banco de dados ou serviço do tipo
 */

export interface IUserAuthRepository{
    validationLogin(props: Object): Promise<UserAuth>
}