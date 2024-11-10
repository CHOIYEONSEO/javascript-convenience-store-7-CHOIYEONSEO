import Receipt from "../src/Model/Receipt.js";

const receipt = new Receipt();

describe("Receipt 테스트", () => {
    test("구매 상품 내역을 추가한다", () => {
        const value1 = ["사이다", 5, 1000];
        const value2 = ["콜라", 3, 1700];
        const value3 = ["물", 3, 1400];
        const value4 = ["탄산수", 2, 1300];
        receipt.setProducts(...value1);
        receipt.setProducts(...value2);
        receipt.setProducts(...value3);
        receipt.setProducts(...value4);

        expect(receipt.getProducts()).toEqual([value1, value2, value3, value4]);
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

    test("프로모션 미적용 구매상품을 추가한다", () => {
        const value1 = ["콜라", 4];
        const value2 = ["탄산수", 2];

        receipt.setRegular(...value1);
        receipt.setRegular(...value2);

        expect(receipt.getRegular()).toEqual([value1, value2]);
    })

    // receipt의 구매 상품 내역 : [["사이다", 5, 1000], ["콜라", 3, 1700], ["물", 3, 1400]], ["탄산수", 2, 1300]
    test("총 구매 수량을 반환한다", () => {
        expect(receipt.getTotalNumber()).toBe(13);
    })

    test("총 구매액을 반환한다", () => {
        expect(receipt.getTotalPrice()).toBe(16900);
    })

    // receipt의 증정 상품 내역 : [["콜라", 1, 1700], ["물", 2, 1400]]
    test("프로모션에 의해 할인된 금액을 반환한다", () => {
        expect(receipt.getPromotionPrice()).toBe(4500);
    })

    // receipt의 프로모션 미적용 구매상품 내역 : [["콜라", 4],["탄산수", 2]]
    test("프로모션 미적용 금액을 반환한다", () => {
        expect(receipt.getRegularPrice()).toBe(9400);
    })

    test("멤버십 할인 금액을 계산한다", () => {
        expect(receipt.getMembershipPrice()).toBe(2820);
    })

    test("멤버십 할인의 최대 한도는 8000원이다", () => {       
        const value1 = ["콜라", 20];
        const value2 = ["탄산수", 20];

        receipt.setRegular(...value1);
        receipt.setRegular(...value2);

        expect(receipt.getRegularPrice()).toBe(69400);
        expect(receipt.getMembershipPrice()).toBe(8000);
    })

    test("멤버십 할인을 적용하지 않으면 0을 반환한다", () => {
        expect(receipt.setMembershipPrice("N")).toBe(0);
    })

    test("상품이름으로 상품 정보를 찾는다", () => {
        const name = "콜라";

        expect(receipt.findByName(name)).toEqual(["콜라", 3, 1700]);
    })
})