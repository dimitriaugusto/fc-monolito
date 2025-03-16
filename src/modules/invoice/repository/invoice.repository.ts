import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/InvoiceGateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async add(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                items: invoice.items.map(item => ({
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                    createdAt: item.createdAt || new Date(),
                    updatedAt: item.updatedAt || new Date()
                })),
                createdAt: invoice.createdAt || new Date(),
                updatedAt: invoice.updatedAt || new Date()
            },
            {
                include: [{ model: InvoiceItemModel }],
            })
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: ["items"],
        });

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipCode,
            ),
            items: invoice.items.map(item => {
                return new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                });
            }),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,

        });
    }
}