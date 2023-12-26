import { knex } from "../../services/Database/connection";
import { ResponseDTO } from "../../utils/DTOs/ResponseDTO";
import { IRegisterUserRepository } from "../IRegisterUserRepository";
import bcrypt from "bcrypt";

export class RegisterUserProvider implements IRegisterUserRepository {
  async register(props: any): Promise<ResponseDTO> {
    const hash = bcrypt.hashSync(props.password, 10);
    props.password = hash;
    await knex("tb_users").insert(props);

    return { message: "New user created successfully" };
  }
}
