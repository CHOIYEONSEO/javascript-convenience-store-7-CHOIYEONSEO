import Receipt from "../src/Model/Receipt.js";

const receipt = new Receipt();

describe("Receipt 테스트", () => {
    test("구매 상품 내역을 추가한다", () => {
        const value = ["사이다", 5, 1000];
        receipt.setProducts(...value);

        expect(receipt.getProducts()).toEqual([["사이다", 5, 1000]]);
    })
})