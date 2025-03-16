import { Sequelize } from "sequelize-typescript"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import InvoiceItemModel from "../repository/invoice-item.model"
import InvoiceModel from "../repository/invoice.model"

describe("Invoice Facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should generate an invoice", async () => {

        const facade = InvoiceFacadeFactory.create();
        const input = {
            id: "1",
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "12345-123",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 200,
                }
            ]
        }
        await facade.generate(input)

        const invoice = await InvoiceModel.findOne({ where: { id: "1" }, include: ["items"] })
        expect(invoice).toBeDefined()
        expect(invoice.id).toBe("1")
        expect(invoice.name).toBe("Lucian")
        expect(invoice.document).toBe("1234-5678")
        expect(invoice.street).toBe("Rua 123")
        expect(invoice.number).toBe("99")
        expect(invoice.complement).toBe("Casa Verde")
        expect(invoice.city).toBe("Criciúma")
        expect(invoice.state).toBe("SC")
        expect(invoice.zipCode).toBe("12345-123")
        expect(invoice.items).toHaveLength(2)
        expect(invoice.items[0].id).toBe("1")
        expect(invoice.items[0].name).toBe("Item 1")
        expect(invoice.items[0].price).toBe(100)
        expect(invoice.items[1].id).toBe("2")
        expect(invoice.items[1].name).toBe("Item 2")
        expect(invoice.items[1].price).toBe(200)
    })

    it("should find an invoice", async () => {

        const facade = InvoiceFacadeFactory.create();
        const input = {
            id: "1",
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "12345-123",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 200,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        await InvoiceModel.create(input, { include: [InvoiceItemModel] })

        const invoiceInDB = await facade.find({ id: "1" })
        expect(invoiceInDB).toBeDefined()
        expect(invoiceInDB.id).toBe("1")
        expect(invoiceInDB.name).toBe("Lucian")
        expect(invoiceInDB.document).toBe("1234-5678")
        expect(invoiceInDB.address.street).toBe("Rua 123")
        expect(invoiceInDB.address.number).toBe("99")
        expect(invoiceInDB.address.complement).toBe("Casa Verde")
        expect(invoiceInDB.address.city).toBe("Criciúma")
        expect(invoiceInDB.address.state).toBe("SC")
        expect(invoiceInDB.address.zipCode).toBe("12345-123")
        expect(invoiceInDB.items).toHaveLength(2)
        expect(invoiceInDB.items[0].id).toBe("1")
        expect(invoiceInDB.items[0].name).toBe("Item 1")
        expect(invoiceInDB.items[0].price).toBe(100)
        expect(invoiceInDB.items[1].id).toBe("2")
        expect(invoiceInDB.items[1].name).toBe("Item 2")
        expect(invoiceInDB.items[1].price).toBe(200)
    })

})