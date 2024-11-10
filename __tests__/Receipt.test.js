import Receipt from "../src/Model/Receipt.js";

const receipt = new Receipt();

describe("Receipt 테스트", () => {
    test("구매 상품 내역을 추가한다", () => {
        const value = ["사이다", 5, 1000];
        receipt.setProducts(...value);

        expect(receipt.getProducts()).toEqual([["사이다", 5, 1000]]);
    })

    test("증정품 개수가 0보다 클 경우 증정 상품 내역에 정보를 추가한다", () => {
        const value1 = ["사이다", 0, 1000];
        const value2 = ["콜라", 1, 1700];
        const value3 = ["물", 2, 1400];
        
        receipt.setFree(...value1);
        receipt.setFree(...value2);
        receipt.setFree(...value3);

        expect(receipt.getFree()).toEqual([value2, value3]);
    })
})