import Receipt from "../src/Model/Receipt.js";

const receipt = new Receipt();

describe("Receipt 테스트", () => {
    test("구매 상품 내역을 추가한다", () => {
        const value1 = ["사이다", 5, 1000];
        const value2 = ["콜라", 3, 1700];
        const value3 = ["물", 1, 1400];
        receipt.setProducts(...value1);
        receipt.setProducts(...value2);
        receipt.setProducts(...value3);

        expect(receipt.getProducts()).toEqual([["사이다", 5, 1000], ["콜라", 3, 1700], ["물", 1, 1400]]);
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

    // receipt의 구매 상품 내역 : [["사이다", 5, 1000], ["콜라", 3, 1700], ["물", 1, 1400]]
    test("총 구매 수량을 반환한다", () => {
        expect(receipt.getTotalNumber()).toBe(9);
    })

    test("총 구매액을 반환한다", () => {
        expect(receipt.getTotalPrice()).toBe(11500);
    })
})