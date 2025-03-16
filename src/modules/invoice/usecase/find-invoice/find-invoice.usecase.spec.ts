import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

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


const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Find Invoice use case unit test", () => {
    it("should return a invoice", async () => {
        const invoiceRepository = MockRepository();
        const findInvoiceUsecase = new FindInvoiceUsecase(invoiceRepository);

        const invoice = await findInvoiceUsecase.execute({ id: "1" });

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(invoice.id).toEqual("1");
        expect(invoice.name).toEqual("Lucian");
        expect(invoice.document).toEqual("1234-5678");
        expect(invoice.address).toEqual(invoice.address);
        expect(invoice.items).toEqual(invoice.items);
        expect(invoice.total).toEqual(300);
        expect(invoice.createdAt).toEqual(invoice.createdAt);
    });
});