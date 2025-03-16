import request from "supertest";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { app, sequelize } from "../express";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should get an invoice", async () => {
    const input = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "Main St",
      number: "123",
      complement: "Apt 4B",
      city: "Metropolis",
      state: "NY",
      zipCode: "12345",
      items: [
        {
          id: "item1",
          name: "Product 1",
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "item2",
          name: "Product 2",
          price: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await InvoiceModel.create(input, { include: [{ model: InvoiceItemModel }], });


    const response = await request(app)
      .get("/invoice/1")
      .send(input);
    expect(response.status).toBe(200);

    expect(response.body.id).toBe(input.id);
    expect(response.body.name).toBe(input.name);
    expect(response.body.document).toBe(input.document);
    expect(response.body.address.street).toBe(input.street);
    expect(response.body.address.number).toBe(input.number);
    expect(response.body.address.complement).toBe(input.complement);
    expect(response.body.address.city).toBe(input.city);
    expect(response.body.address.state).toBe(input.state);
    expect(response.body.address.zipCode).toBe(input.zipCode);
    expect(response.body.total).toBe(300);
    expect(new Date(response.body.createdAt)).toEqual(input.createdAt);
    expect(response.body.items).toHaveLength(input.items.length);
    expect(response.body.items[0].id).toBe(input.items[0].id);
    expect(response.body.items[0].name).toBe(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toBe(input.items[1].id);
    expect(response.body.items[1].name).toBe(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);

  });

});
