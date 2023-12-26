import { UserAuth } from "../../entities/UserAuth";
import { knex } from "../../services/Database/connection";
import { IUserAuthRepository } from "../IUserAuthRepository";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const process: any = require("process");

export class UserAuthProvider implements IUserAuthRepository {
  async validationLogin(props: any): Promise<UserAuth> {
    const user = await knex("tb_users").where({ email: props?.email }).first();

    if (!user) return { status: 403, message: "invalid login." };
    else {
      const verifyPass = await bcrypt.compare(props.password, user.password);

      if (!verifyPass) return { status: 403, message: "invalid login." };

      const token = Jwt.sign(
        { id: user.id, email: user.email, type_user: user.type_user },
        process.env.SECRET_KEY,
        {
          expiresIn: `${process.env.EXPIRES_IN}d`,
        }
      );

      return { status: 200, bearer_token: token, expires_in: `${process.env.EXPIRES_IN}d` };
    }
  }
}
