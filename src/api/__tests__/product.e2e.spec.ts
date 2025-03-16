import request from "supertest";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { app, sequelize } from "../express";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Wireless Mouse",
        description: "Mouse sem fio",
        purchasePrice: 100,
        stock: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Wireless Mouse");
    expect(response.body.description).toBe("Mouse sem fio");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "wireless mouse",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {

    const response = await request(app)
      .post("/product")
      .send({
        name: "Wireless Mouse",
        description: "Mouse sem fio",
        purchasePrice: 100,
        stock: 10,
      });
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Wireless Microphone",
        description: "Microfone sem fio",
        purchasePrice: 200,
        stock: 15,
      });
    expect(response2.status).toBe(200);

    await ProductModel.findAll().then((products) => {
      expect(products.length).toBe(2);

      const product = products[0];
      expect(product.name).toBe("Wireless Mouse");
      expect(product.description).toBe("Mouse sem fio");
      expect(product.purchasePrice).toBe(100);

      const product2 = products[1];
      expect(product2.name).toBe("Wireless Microphone");
      expect(product2.description).toBe("Microfone sem fio");
      expect(product2.purchasePrice).toBe(200);

    });

  });
});
