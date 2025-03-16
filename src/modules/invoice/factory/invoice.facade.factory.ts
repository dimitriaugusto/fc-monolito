import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice";

export default class InvoiceFacadeFactory {

    static create() {
        const repository = new InvoiceRepository();
        return new InvoiceFacade({
            generateUsecase: new GenerateInvoiceUsecase(repository),
            findUsecase: new FindInvoiceUsecase(repository),
        });
    }
}