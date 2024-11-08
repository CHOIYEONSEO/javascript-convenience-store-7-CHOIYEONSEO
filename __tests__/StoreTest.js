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
});