import Product from "../src/Model/Product.js";

describe("상품 기능 테스트", () => {
    test("상품은 생성자로 인스턴스 값이 할당된다", () => {
        const productArr = ['콜라','1000','10','탄산2+1'];

        const product = new Product(...productArr);

        expect(product.name).toBe(productArr[0]);
        expect(product.price).toBe(productArr[1]);
        expect(product.quantity).toBe(productArr[2]);
        expect(product.promotion).toBe(productArr[3]);

    });
});