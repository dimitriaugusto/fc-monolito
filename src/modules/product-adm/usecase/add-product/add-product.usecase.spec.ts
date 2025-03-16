import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Product usecase unit test", () => {
  it("should add a product", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.purchasePrice).toBe(input.purchasePrice);
    expect(result.stock).toBe(input.stock);
  });

  it("should raise an error when adding a product with invalid data", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);

    const input = {
      name: "Pr",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    await expect(usecase.execute(input)).rejects.toThrow("Name must have at least 3 characters");

    const input2 = {
      name: "",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    await expect(usecase.execute(input2)).rejects.toThrow("Name must have at least 3 characters");

    const input3 = {
      name: "Product 1",
      description: "",
      purchasePrice: 100,
      stock: 10,
    };
    await expect(usecase.execute(input3)).rejects.toThrow("Description must have at least 3 characters");

    const input4 = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 0,
      stock: 10,
    };
    await expect(usecase.execute(input4)).rejects.toThrow("Purchase price must be greater than 0");

    const input5 = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      stock: 0,
    };
    await expect(usecase.execute(input5)).rejects.toThrow("Stock must be greater than or equal to 0");

  });
});
