import request from "supertest";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { app, sequelize } from "../express";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do a checkout", async () => {
    const input = {
      orderId: "1",
      amount: 100,
    };

    const response = await request(app)
      .post("/checkout")
      .send(input);
    expect(response.status).toBe(200);

    await TransactionModel.findAll().then((transaction) => {
      expect(transaction.length).toBe(1);
      expect(transaction[0].orderId).toBe(input.orderId);
      expect(transaction[0].amount).toBe(input.amount);
    });

  });

});
