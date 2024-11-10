import Store from "../src/Controller/Store.js";
import Product from "../src/Model/Product.js";
import Promotion from "../src/Model/Promotion.js";
import InputView from "../src/View/InputView.js";
import OutputView from "../src/View/OutputView.js";

const promotions = [
    new Promotion("탄산2+1", "2", "1", "2024-01-01", "2024-12-31")
]

const products = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("사이다", 1000, 8, "탄산2+1")
];
const store = new Store(products, promotions); // store.checkExistence() 메서드가 target.isExistence() 사용중이라. 리팩토링?

const products1 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("콜라", 1000, 8, "null")
];
const store1 = new Store(products1, promotions);

const products2 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("사이다", 1000, 8, "null")
];
const store2 = new Store(products2, promotions);

describe("Store 테스트", () => {
    let store3;
    let mockInputView;

    beforeEach(() => {
        mockInputView = {
            getMore: jest.fn(),
            buy: jest.fn(),
        };

        store3 = new Store(products2, promotions, mockInputView);
    });

    // store
    test("존재하는 상품을 입력하면 에러가 발생하지 않는다", () => {
        const input = [['콜라', 3], ['사이다', 1]];

        expect(() => store.checkExistence(input, products)).not.toThrow("[ERROR]");
       
    });

    test("존재하지 않는 상품을 입력하면 에러 처리한다", () => {
        const input = [['감', 3]];

        expect(() => store.checkExistence(input, products)).toThrow("[ERROR]");
       
    });

    test("사용자가 잘못된 값을 입력하면 애러 발생시키고 해당 지점부터 다시 입력 받는다", () => {
        /* getPurchaseInput 테스트 어려움  
        
                let input = [['감', 3]];
                expect(() => store.getPurchaseInput(input, products)).toThrow("[ERROR]");
        
                input = [['사이다', 5]];
                expect(() => store.getPurchaseInput(input, products)).not.toThrow("[ERROR]");
        */
            })

    // store 1
    test.each([18, 10])("구매 수량(%s)이 재고 수량을 초과하지 않으면 에러가 발생하지 않는다", (condition) => {

        expect(() => store1.checkOverStock(condition, products1)).not.toThrow("[ERROR]");

    });

    test.each([2000, 19])("구매 수량(%s)이 재고 수량을 초과하면 에러 처리한다", (condition) => {

        expect(() => store1.checkOverStock(condition, products1)).toThrow("[ERROR]");

    });

    test("구매할 상품이 프로모션 상품일 때 true를 반환한다", () => {
        const purchaseProduct = '콜라';

        expect(store1.isPromotion(purchaseProduct)).toBe(true);
    })

    test("구매할 상품이 프로모션 상품이면 프로모션 재고를 차감한다", async () => {
        const purchaseProduct = ['콜라', 6];

        await store1.purchase(purchaseProduct);

        expect(store1.products[0].quantity).toBe(4);
        expect(store1.products[1].quantity).toBe(8);
    })

    // store2
    test("구매할 상품이 프로모션 상품이 아니면 false를 반환한다", () => {
        const purchaseProduct = '사이다';

        expect(store2.isPromotion(purchaseProduct)).toBe(false);
    })

    test("구매할 상품이 프로모션 상품이 아니면 일반 재고를 차감한다", () => {
        const purchaseProduct = ['사이다', 5];

        store2.purchase(purchaseProduct);

        expect(store2.products[0].quantity).toBe(10);
        expect(store2.products[1].quantity).toBe(3);
    })

    // store3
    test("상품이 어떤 프로모션이 진행중인지 반환한다", () => {
        const product = "콜라";

        expect(store3.whatPromotion(product)).toBe("탄산2+1");
    })

    test.each([2, 5, 8])("2+1인 상품에 대해 고객이 %s개 가져온 경우 더 가져올 개수와 추가 여부를 반환한다", async (condition) => {
        const product = "콜라";

        mockInputView.getMore.mockResolvedValueOnce("Y");
        const { getMore, addIntention } = await store3.checkDemandNumber(product, condition);
        expect(getMore).toBe(1);
    })

    test.each([4, 7, 10])("2+1인 상품에 대해 고객이 %s개 가져온 경우 더 가져올 개수와 추가 여부를 반환한다", async (condition) => {
        const product = "콜라";

        mockInputView.getMore.mockResolvedValueOnce("Y");
        const { getMore, addIntention } = await store3.checkDemandNumber(product, condition);
        expect(getMore).toBe(2);
    })

    test("2+1 상품을 4개만 가져온 경우 2개를 더 추가하지 않고 재고를 차감한다", async () => {
        const product = ["콜라", 4];

        mockInputView.getMore.mockResolvedValueOnce("N");
        await store3.purchase(product);

        expect(store3.products[0].quantity).toBe(6);
    })

    test("2+1 상품을 4개만 가져온 경우 2개를 더 추가해서 재고를 차감한다", async () => {
        const product = ["콜라", 4];

        mockInputView.getMore.mockResolvedValueOnce("Y");
        await store3.purchase(product);

        expect(store3.products[0].quantity).toBe(0);
    })

});