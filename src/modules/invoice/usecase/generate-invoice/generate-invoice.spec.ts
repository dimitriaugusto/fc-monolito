import GenerateInvoiceUsecase from "./generate-invoice"

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
    ],
    createdAt: new Date(),
    updatedAt: new Date()
}

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}

describe("Generate Invoice use case unit test", () => {

    it("should generate a invoice", async () => {

        const repository = MockRepository()
        const usecase = new GenerateInvoiceUsecase(repository)

        const result = await usecase.execute(input)

        expect(repository.add).toHaveBeenCalled()
        expect(result.name).toEqual(input.name)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city)
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)
        expect(result.items).toEqual(input.items)
        expect(result.total).toEqual(300)

    })

})