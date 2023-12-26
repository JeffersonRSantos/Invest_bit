import { describe, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../utils/app";

describe("(POST) /_register", () => {
  test("testing create user valid", async () => {
    await request(app)
      .post("/_register")
      .send({
        name_full: "pedro soares",
        email: "pedro@soares.com",
        password: "1234567",
      })
      .expect(201)
      .then((response) => {
        console.log(response.text);
      })
  });
});

describe("(POST) /_register", () => {
  test("testing create user with email invalid", async () => {
    await request(app)
      .post("/_register")
      .send({
        name_full: "pedro soares",
        email: "pedro",
        password: "1234567",
      })
      .expect(401)
      .then((response) => {
        console.log(response.text);
      });
  });
});
