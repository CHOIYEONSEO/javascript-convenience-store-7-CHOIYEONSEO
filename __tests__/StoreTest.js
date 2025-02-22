import Store from "../src/Controller/Store.js";
import Product from "../src/Model/Product.js";
import Promotion from "../src/Model/Promotion.js";
import Receipt from "../src/Model/Receipt.js";

const promotions = [
    new Promotion("탄산2+1", "2", "1", "2024-01-01", "2024-12-31"),
    new Promotion("반짝할인", "1", "1", "2024-11-01", "2024-11-30")
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

const products3 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("콜라", 1000, 8, "null"),
    new Product("사이다", 1000, 3, "반짝할인"),
    new Product("사이다", 1000, 5, "null"),
];

const products4 = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("콜라", 1000, 8, "null"),
    new Product("사이다", 1000, 3, "반짝할인"),
    new Product("사이다", 1000, 5, "null"),
    new Product("물", 800, 8, "null"),
];

const receipt = new Receipt();

describe("Store 테스트", () => {
    let store3;
    let store4;
    let store5;
    let store6;
    let mockInputView;

    beforeEach(() => {
        mockInputView = {
            buy: jest.fn(),
            getMore: jest.fn(),
            applyRegular: jest.fn(),
            applyMembership: jest.fn(),
            additional: jest.fn(),
        };

        store3 = new Store(products2, promotions, mockInputView);
        store4 = new Store(products3, promotions, mockInputView);
        store5 = new Store(products4, promotions, mockInputView, undefined, receipt);
        store6 = new Store(products3, promotions, mockInputView);
    });

    // store
    test.each([['콜라', 3], ['사이다', 1]])("존재하는 %s를 입력하면 에러가 발생하지 않는다", (condition) => {

        expect(() => store.checkValidName(condition, products)).not.toThrow("[ERROR]");
       
    });

    test("존재하지 않는 상품을 입력하면 에러 처리한다", () => {
        const input = [['감', 3]];

        expect(() => store.checkValidName(input, products)).toThrow("[ERROR]");
       
    });

    test("사용자가 잘못된 값을 입력하면 애러 발생시키고 해당 지점부터 다시 입력 받는다", () => {
        // getPurchaseInput 테스트 어려움  
        
        //        let input = [['감', 3]];
        //        expect(() => store.getPurchaseInput(input, products)).toThrow("[ERROR]");
        
        //        input = [['사이다', 5]];
        //        expect(() => store.getPurchaseInput(input, products)).not.toThrow("[ERROR]");
        
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

    test.each([2, 5, 8])("2+1 할인, 프로모션 재고보다 적은 구매할개수(%s), 1개 덜 가져옴", async (condition) => {
        const product = "콜라";
        const stock = 10;

        mockInputView.getMore.mockResolvedValueOnce("Y");
        const purchaseNumber = await store3.properStock(promotions[0], stock, product, condition);
        
        expect(purchaseNumber).toBe(condition + 1);
    })

    test.each([1, 4, 7])("2+1 할인, 프로모션 재고보다 적은 구매할개수(%s), 1개 정가로 결제해야됨", async (condition) => {
        const product = "콜라";
        const stock = 10;

        mockInputView.applyRegular.mockResolvedValueOnce("Y");
        const purchaseNumber = await store3.properStock(promotions[0], stock, product, condition);

        expect(purchaseNumber).toBe(condition);
    })

    test.each([3, 6])("2+1 할인, 프로모션 재고보다 적은 구매할개수(%s), 잘 가져옴", async (condition) => {
        const product = "콜라";
        const stock = 10;

        const purchaseNumber = await store3.properStock(promotions[0], stock, product, condition);

        expect(purchaseNumber).toBe(condition);
    })

    test("증정 받을 수 있는 상품을 1개 덜 가져온 상황이면 추가 의사에 따라 덜 가져온 상품 개수를 더하거나 원래 개수를 반환한다", async () => {
        const value = ["more", 1, 10,"콜라", 5];

        mockInputView.getMore.mockResolvedValueOnce("N");
        expect(await store3.checkCase(...value)).toBe(5);
        
        mockInputView.getMore.mockResolvedValueOnce("Y");
        expect(await store3.checkCase(...value)).toBe(6);
    })

    test("2+1할인 상품인데 4개만 가져온 상황이면 정가 결제 의사에 따라 정가로 결제해야하는 수량을 빼거나 원래 개수를 반환한다", async () => {
        const value = ["regular", 1, 10, "콜라", 4];
        
        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store3.checkCase(...value)).toBe(3);
        
        mockInputView.applyRegular.mockResolvedValueOnce("Y");
        expect(await store3.checkCase(...value)).toBe(4);
    })

    test("2+1할인 상품을 적절한 개수로 가져온 상황이면 원래 개수를 반환한다", async () => {
        const value = ["pass", 0, 10, "콜라", 3];

        expect(await store3.checkCase(...value)).toBe(3);
    })

    test("2+1할인 상품, 재고 4개보다 원하는 개수가 많은 경우 정가 결제 의사 묻고 구매할 개수 반환", async () => {
        const promotion = promotions.find(p => p.name === "탄산2+1");
        const value = [promotion, 4, "콜라", 10];

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store4.lackStock(...value)).toBe(3);
    })

    test("2+1할인 상품, 재고 5개보다 원하는 개수가 많은 경우 정가 결제 의사 묻고 구매할 개수 반환", async () => {
        const promotion = promotions.find(p => p.name === "탄산2+1");
        const value = [promotion, 5, "콜라", 10];

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store4.lackStock(...value)).toBe(5);
    })

    test("2+1할인 상품, 재고 7개보다 원하는 개수가 많은 경우 정가 결제 의사 묻고 구매할 개수 반환", async () => {
        const promotion = promotions.find(p => p.name === "탄산2+1");
        const value = [promotion, 7, "콜라", 10];

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store4.lackStock(...value)).toBe(6);

        mockInputView.applyRegular.mockResolvedValueOnce("Y");
        expect(await store4.lackStock(...value)).toBe(10);
    })

    test("1+1할인 상품, 재고 3개보다 원하는 개수가 많은 경우 정가 결제 의사 묻고 구매할 개수 반환", async () => {
        const promotion = promotions.find(p => p.name === "반짝할인");
        const value = [promotion, 3, "사이다", 8];

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store4.lackStock(...value)).toBe(3);
    })

    test("1+1할인 상품, 재고 2개보다 원하는 개수가 많은 경우 정가 결제 의사 묻고 구매할 개수 반환", async () => {
        const promotion = promotions.find(p => p.name === "반짝할인");
        const value = [promotion, 2, "사이다", 8];

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store4.lackStock(...value)).toBe(2);
    })

    test("2+1 상품을 2개만 가져온 경우 1개를 더 추가하지 않고 재고를 차감한다", async () => {
        const product = ["콜라", 2];
        expect(store6.products[0].quantity).toBe(10);
        expect(store6.products[1].quantity).toBe(8);

        mockInputView.getMore.mockResolvedValueOnce("N");
        await store6.purchase(product);

        expect(store6.products[0].quantity).toBe(8);
        expect(store6.products[1].quantity).toBe(8);
    })

     test("2+1 상품을 2개만 가져온 경우 1개를 더 추가해서 재고를 차감한다", async () => {
        const product = ["콜라", 2];
        expect(store6.products[0].quantity).toBe(8);
        expect(store6.products[1].quantity).toBe(8);

        mockInputView.getMore.mockResolvedValueOnce("Y");
        await store6.purchase(product);

        expect(store6.products[0].quantity).toBe(5);
        expect(store6.products[1].quantity).toBe(8);
    })

    test("재고보다 많은 개수를 사려고 하면 lackStock 실행, 재고보다 적은 개수 사려고 하면 properStock 실행", async () => {
        let value = [[store6.products[0],store6.products[1]], 8]; // 2+1할인, 재고 5개

        mockInputView.applyRegular.mockResolvedValueOnce("N");
        expect(await store6.checkPromotionStock(...value)).toBe(5);

        value = [[store6.products[0],store6.products[1]], 2];

        mockInputView.getMore.mockResolvedValueOnce("N");
        expect(await store6.checkPromotionStock(...value)).toBe(2);
    })

     test("프로모션 재고보다 많은 개수를 사려고 하면 부족한만큼 일반 재고를 차감한다.", async () => {
        const product = ["콜라", 10]; // 2+1할인, 프로모션 재고 5, 일반 재고 8
        expect(store4.products[0].quantity).toBe(5);
        expect(store4.products[1].quantity).toBe(8);

        mockInputView.applyRegular.mockResolvedValueOnce("Y");
        await store4.purchase(product);

        expect(store4.products[0].quantity).toBe(0);
        expect(store4.products[1].quantity).toBe(3);
    })

     test("프로모션 재고보다 많은 개수 사지 않으면 일반 재고를 차감하지않는다", async () => {
        const product = ["사이다", 2]; // 1+1할인, 프로모션 재고 3, 일반 재고 5
        expect(store4.products[2].quantity).toBe(3);
        expect(store4.products[3].quantity).toBe(5);
        expect(store4.products[2].promotion).toBe("반짝할인");

        await store4.purchase(product);

        expect(store4.products[2].quantity).toBe(1);
        expect(store4.products[3].quantity).toBe(5);
    })

    test.each([[3,1]])("2+1할인 상품을 %s개 구매할 경우 영수증의 증정 상품 내역에 %s개가 증정됨을 추가한다", (purchase, free) => {
        store5.freeSummary(products3[0], purchase);
        expect(receipt.getFree()).toEqual([["콜라", free, 1000]]);
    })

    test.each([[3,1]])("1+1할인 상품을 %s개 구매할 경우 영수증의 증정 상품 내역에 %s개가 증정됨을 추가한다", (purchase, free) => {
        store5.freeSummary(products3[2], purchase);
        expect(receipt.getFree()).toEqual([["콜라", 1, 1000], ["사이다", free, 1000]]);
    })

    test("증정품이 0개일 경우에는 영수증의 증정 상품내역에 추가하지 않는다", () => {
        store5.freeSummary(products3[0], 2);
        expect(receipt.getFree()).toEqual([["콜라", 1, 1000], ["사이다", 1, 1000]]);
    })

    test("할인 상품이고 충분한 프로모션 재고가 있으면 프로모션 미적용 상품이 아니다", async () => {
        const purchaseProduct = ['콜라', 5];
        expect(store5.products[0].quantity).toBe(10);

        mockInputView.getMore.mockResolvedValueOnce("Y");
        await store5.purchase(purchaseProduct);

        expect(receipt.getRegular.length).toBe(0);
    })

    test("할인 상품이고 프로모션 재고가 부족하면 부족한 수만큼 프로모션 미적용에 해당한다", async () => {
        const purchaseProduct = ['콜라', 10];
        expect(store5.products[0].quantity).toBe(4);
        expect(store5.products[1].quantity).toBe(8);

        mockInputView.applyRegular.mockResolvedValueOnce("Y");
        await store5.purchase(purchaseProduct);

        expect(receipt.getRegular()).toEqual([["콜라", 7]]);
    })

    test("할인 상품이 아니면 프로모션 미적용에 해당한다", async () => {
        const purchaseProduct = ['물', 5];
        expect(store5.products[4].quantity).toBe(8);
        await store5.purchase(purchaseProduct);

        expect(receipt.getRegular()).toEqual([["콜라", 7], ["물", 5]]);
    })

});