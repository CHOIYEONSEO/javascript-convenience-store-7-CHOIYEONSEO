import Product from "../src/Model/Product.js";

const productArr = ['콜라','1000','10','탄산2+1'];
const product = new Product(...productArr);

describe("상품 기능 테스트", () => {
    test("상품은 생성자로 인스턴스 값이 할당된다", () => {
        
        expect(product.name).toBe(productArr[0]);
        expect(product.price).toBe(1000);
        expect(product.quantity).toBe(10);
        expect(product.promotion).toBe(productArr[3]);

    });

    test("상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.", () => {
        const BUY_NUMBER = [2];

        product.decreaseQuantity(BUY_NUMBER);
        expect(product.quantity).toBe(8);
    })
});