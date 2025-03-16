import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/InvoiceGateway";
import { GenerateInvoiceUsecaseInputDto, GenerateInvoiceUsecaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUsecase {
    private _invoiceRepository;
    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }
    async execute(input: GenerateInvoiceUsecaseInputDto): Promise<GenerateInvoiceUsecaseOutputDto> {

        const invoice = new Invoice({
            id: new Id(input.id) || new Id(),
            name: input.name,
            document: input.document,
            address: new Address(
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode
            ),
            items: input.items.map(item =>
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            )
        });

        await this._invoiceRepository.add(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address._complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.items.reduce((sum, item) => sum + item.price, 0)
        }
    }
}