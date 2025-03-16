import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { app, sequelize } from "../express";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const input = {
      name: "Joao Silva",
      email: "joao@silva",
      document: "1234-5678",
      address: {
        street: "123 Main St",
        number: "456",
        complement: "Apt 789",
        city: "Anytown",
        state: "CA",
        zipCode: "90210",
      }
    };

    const response = await request(app)
      .post("/client")
      .send(input);
    expect(response.status).toBe(200);

    await ClientModel.findAll().then((clients) => {
      expect(clients.length).toBe(1);
      expect(clients[0].name).toBe(input.name);
      expect(clients[0].email).toBe(input.email);
      expect(clients[0].document).toBe(input.document);
      expect(clients[0].street).toBe(input.address.street);
      expect(clients[0].number).toBe(input.address.number);
      expect(clients[0].complement).toBe(input.address.complement);
      expect(clients[0].city).toBe(input.address.city);
      expect(clients[0].state).toBe(input.address.state);
      expect(clients[0].zipcode).toBe(input.address.zipCode);
    });

  });

});
