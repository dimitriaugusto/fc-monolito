import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository unit test", () => {

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

    it("should create an invoice", async () => {

        const invoiceItems = [
            new InvoiceItem({
                id: new Id("1"),
                name: "Item 1",
                price: 100,
            }),
            new InvoiceItem({
                id: new Id("2"),
                name: "Item 2",
                price: 200,
            })
        ];

        const invoice = new Invoice({
            id: new Id("1"),
            name: "Lucian",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "12345-123"),
            items: invoiceItems,
        })

        const invoiceRepository = new InvoiceRepository()
        await invoiceRepository.add(invoice)

        const invoiceFromDb = await InvoiceModel.findOne({
            where: { id: "1" },
            include: ["items"],
        })
        expect(invoiceFromDb).toBeDefined()
        expect(invoiceFromDb.id).toEqual(invoice.id.id)
        expect(invoiceFromDb.name).toEqual(invoice.name)
        expect(invoiceFromDb.document).toEqual(invoice.document)
        expect(invoiceFromDb.street).toEqual(invoice.address.street)
        expect(invoiceFromDb.number).toEqual(invoice.address.number)
        expect(invoiceFromDb.complement).toEqual(invoice.address.complement)
        expect(invoiceFromDb.city).toEqual(invoice.address.city)
        expect(invoiceFromDb.state).toEqual(invoice.address.state)
        expect(invoiceFromDb.zipCode).toEqual(invoice.address.zipCode)
        expect(invoiceFromDb.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceFromDb.updatedAt).toStrictEqual(invoice.updatedAt)
        expect(invoiceFromDb.items.length).toEqual(invoice.items.length);
        for (let i = 0; i < invoice.items.length; i++) {
            expect(invoiceFromDb.items[i].id).toEqual(invoice.items[i].id.id);
            expect(invoiceFromDb.items[i].name).toEqual(invoice.items[i].name);
            expect(invoiceFromDb.items[i].price).toEqual(invoice.items[i].price);
            expect(invoiceFromDb.items[i].createdAt).toStrictEqual(invoice.items[i].createdAt);
            expect(invoiceFromDb.items[i].updatedAt).toStrictEqual(invoice.items[i].updatedAt);
        }

    })

    it("should find an invoice", async () => {

        const invoice = await InvoiceModel.create(
            {
                id: '1',
                name: 'Lucian',
                document: '1234-5678',
                street: 'Rua 123',
                number: '99',
                complement: 'Casa Verde',
                city: 'Criciúma',
                state: 'SC',
                zipCode: '12345-123',
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [
                    {
                        id: '1',
                        name: 'Item 1',
                        price: 100,
                        invoiceId: '1',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: '2',
                        name: 'Item 2',
                        price: 200,
                        invoiceId: '1',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },

                ]
            },
            {
                include: [{ model: InvoiceItemModel }],
            }
        )

        const repository = new InvoiceRepository()
        const result = await repository.find(invoice.id)

        expect(result.id.id).toEqual(invoice.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.street)
        expect(result.address.number).toEqual(invoice.number)
        expect(result.address.complement).toEqual(invoice.complement)
        expect(result.address.city).toEqual(invoice.city)
        expect(result.address.state).toEqual(invoice.state)
        expect(result.address.zipCode).toEqual(invoice.zipCode)
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
        expect(result.updatedAt).toStrictEqual(invoice.updatedAt)

        expect(result.items.length).toEqual(invoice.items.length);
        for (let i = 0; i < result.items.length; i++) {
            expect(result.items[i].id.id).toEqual(invoice.items[i].id);
            expect(result.items[i].name).toEqual(invoice.items[i].name);
            expect(result.items[i].price).toEqual(invoice.items[i].price);
            expect(result.items[i].createdAt).toStrictEqual(invoice.items[i].createdAt);
            expect(result.items[i].updatedAt).toStrictEqual(invoice.items[i].updatedAt);
        }
    })

});