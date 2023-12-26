import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../utils/app";

const _token_user: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZWRyb0Bzb2FyZXMuY29tIiwiaWF0IjoxNzAzNTg4ODI5LCJleHAiOjE3MDUzMTY4Mjl9.rTQ9e8rkd_1N_I3iBQL7raNSW61tiFfwd8SsnRN111g";

export const createNewDepostitE2EInvalid = describe("(POST) /_deposit/new", () => {
  test("testing create new deposit invalid", async () => {
    await request(app)
      .post("/_deposit/new")
      .send({
        value_brl: "100.00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .expect(401)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const createNewDepostitE2EValid = describe("(POST) /_deposit/new", () => {
  test("testing create new deposit valid", async () => {
    await request(app)
      .post("/_deposit/new")
      .send({
        value_brl: "8.000,00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .expect(200)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});
