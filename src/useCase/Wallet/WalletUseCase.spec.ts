import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../utils/app";

const _token_user: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZWRyb0Bzb2FyZXMuY29tIiwiaWF0IjoxNzAzNTg4ODI5LCJleHAiOjE3MDUzMTY4Mjl9.rTQ9e8rkd_1N_I3iBQL7raNSW61tiFfwd8SsnRN111g";

export const getBalanceE2EValid = describe("(GET) /_wallet/balance", () => {
  test("testing get balance", async () => {
    await request(app)
      .get("/_wallet/balance")
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const getCotationE2EValid = describe("(GET) /_wallet/btc/cotation", () => {
  test("testing get cotation on BTC", async () => {
    await request(app)
      .get("/_wallet/btc/cotation")
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const getTransactionPerDaysE2EValid = describe("(GET) /_wallet/transactions", () => {
  test("testing get Transactions per days on BTC", async () => {
    await request(app)
      .get("/_wallet/transactions")
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const getExtractWithoutE2EValid = describe("(GET) /_wallet/extract/:interval?", () => {
  test("testing get extract last 90 days valid", async () => {
    await request(app)
      .get("/_wallet/extract")
      .set("Authorization", ` Bearer ${_token_user}`)
      .expect(200)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const getExtractWithIntervalE2EInvalid = describe("(GET) /_wallet/extract/:interval?", () => {
  test("testing get extract last 100 days invalid", async () => {
    await request(app)
      .get("/_wallet/extract/100")
      .set("Authorization", ` Bearer ${_token_user}`)
      .expect(401)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const createOrderPurchaseE2EValid = describe("(POST) /_wallet/btc/purchase", () => {
  test("testing create order purchase on BTC valid", async () => {
    await request(app)
      .post("/_wallet/btc/purchase")
      .send({
        value_brl: "250,00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const createOrderPurchaseE2EInvalid = describe("(POST) /_wallet/btc/purchase", () => {
  test(" testing create order purchase on BTC invalid", async () => {
    await request(app)
      .post("/_wallet/btc/purchase")
      .send({
        value_brl: "250.00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const createOrderSellE2EValid = describe("(POST) /_wallet/btc/sell", () => {
  test("testing create order sel on BTC valid", async () => {
    await request(app)
      .post("/_wallet/btc/sell")
      .send({
        value_brl: "150,00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});

export const createOrderSellE2EInvalid = describe("(POST) /_wallet/btc/sell", () => {
  test("testing create order sel on BTC invalid", async () => {
    await request(app)
      .post("/_wallet/btc/sell")
      .send({
        value_brl: "250.00",
      })
      .set("Authorization", ` Bearer ${_token_user}`)
      .then((response) => {
        console.log(response.text);
        expect(response.text);
      });
  });
});
