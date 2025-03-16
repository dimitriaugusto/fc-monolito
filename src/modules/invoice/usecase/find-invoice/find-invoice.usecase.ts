import InvoiceGateway from "../../gateway/InvoiceGateway";
import { FindInvoiceUsecaseInputDto, FindInvoiceUsecaseOutputDto } from "./find-invoice.dto";

export default class FindInvoiceUsecase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUsecaseInputDto): Promise<FindInvoiceUsecaseOutputDto> {
        const result = await this._invoiceRepository.find(input.id);
        return {
            id: result.id.id,
            name: result.name,
            document: result.document,
            address: {
                street: result.address.street,
                number: result.address.number,
                complement: result.address.complement,
                city: result.address.city,
                state: result.address.state,
                zipCode: result.address.zipCode,
            },
            items: result.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: result.items.reduce((sum, item) => sum + item.price, 0),
            createdAt: result.createdAt
        }
    }
}