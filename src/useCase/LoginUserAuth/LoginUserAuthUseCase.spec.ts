import { expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../utils/app";

describe("(POST) /_login", () => {
  test("testing login invalid", async () => {
    await request(app)
      .post("/_login")
      .send({
        email: "teste",
        password: "teste1234",
      })
      .expect(401)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

describe("(POST) /_login", () => {
  test("testing login valid", async () => {
    await request(app)
      .post("/_login")
      .send({
        email: "pedro@soares.com",
        password: "1234567",
      })
      .expect(200)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});
