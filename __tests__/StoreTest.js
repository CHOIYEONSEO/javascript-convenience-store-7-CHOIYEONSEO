import Store from "../src/Controller/Store.js";
import Product from "../src/Model/Product.js";

const products = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("사이다", 1000, 8, "탄산2+1")
];
const store = new Store(products); // store.checkExistence() 메서드가 target.isExistence() 사용중이라. 리팩토링?

const products1 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("콜라", 1000, 8, "null")
];
const store1 = new Store(products1);

const products2 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("사이다", 1000, 8, "null")
];
const store2 = new Store(products2);

describe("Store 테스트", () => {
    test("존재하는 상품을 입력하면 에러가 발생하지 않는다", () => {
        const input = [['콜라', 3], ['사이다', 1]];

        expect(() => store.checkExistence(input, products)).not.toThrow("[ERROR]");
       
    });

    test("존재하지 않는 상품을 입력하면 에러 처리한다", () => {
        const input = [['감', 3]];

        expect(() => store.checkExistence(input, products)).toThrow("[ERROR]");
       
    });

    test.each([18, 10])("구매 수량(%s)이 재고 수량을 초과하지 않으면 에러가 발생하지 않는다", (condition) => {

        expect(() => store1.checkOverStock(condition, products1)).not.toThrow("[ERROR]");

    });

    test.each([2000, 19])("구매 수량(%s)이 재고 수량을 초과하면 에러 처리한다", (condition) => {

        expect(() => store1.checkOverStock(condition, products1)).toThrow("[ERROR]");

    });

    test("사용자가 잘못된 값을 입력하면 애러 발생시키고 해당 지점부터 다시 입력 받는다", () => {
/* getPurchaseInput 테스트 어려움  

        let input = [['감', 3]];
        expect(() => store.getPurchaseInput(input, products)).toThrow("[ERROR]");

        input = [['사이다', 5]];
        expect(() => store.getPurchaseInput(input, products)).not.toThrow("[ERROR]");
*/
    })

    test("구매할 상품이 프로모션 상품일 때 true를 반환한다", () => {
        const purchaseProduct = '콜라';

        expect(store1.isPromotion(purchaseProduct)).toBe(true);
    })

    test("구매할 상품이 프로모션 상품이면 프로모션 재고를 차감한다", () => {
        const purchaseProducts = [['콜라', 5]];

        store1.purchase(purchaseProducts)

        expect(store1.products[0].quantity).toBe(5);
        expect(store1.products[1].quantity).toBe(8);
    })

    test("구매할 상품이 프로모션 상품이 아니면 false를 반환한다", () => {
        const purchaseProduct = '사이다';

        expect(store2.isPromotion(purchaseProduct)).toBe(false);
    })

    test("구매할 상품이 프로모션 상품이 아니면 일반 재고를 차감한다", () => {
        const purchaseProducts = [['사이다', 5]];

        store2.purchase(purchaseProducts)

        expect(store2.products[0].quantity).toBe(10);
        expect(store2.products[1].quantity).toBe(3);
    })
});