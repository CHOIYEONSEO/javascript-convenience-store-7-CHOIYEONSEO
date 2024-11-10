import Product from "../src/Model/Product.js";

const productArr = ['콜라','1000','10','탄산2+1'];
const product1 = new Product(...productArr);
const product2 = new Product(...productArr);


describe("상품 기능 테스트", () => {
    test("상품은 생성자로 인스턴스 값이 할당된다", () => {
        
        expect(product1.name).toBe('콜라');
        expect(product1.price).toBe(1000);
        expect(product1.quantity).toBe(10);
        expect(product1.promotion).toBe('탄산2+1');

    });

    test.each(["콜라"])("상품 이름이 %s이면 해당 상품을 반환한다", (condition) => {
        if (product1.name == condition) {
            expect(product1.findByName(condition)).toEqual({"name":"콜라", "price": 1000, "promotion": "탄산2+1", "quantity": 10});
        }
    })

    test("상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.", () => {
        const BUY_NUMBER = [2];

        product1.decreaseQuantity(BUY_NUMBER);
        expect(product1.quantity).toBe(8);
    })

    test("상품의 인스턴스 값들을 한줄의 문자열로 반환한다.", () => {
        expect(`${product1}`).toBe("콜라,1000,8,탄산2+1\n");
        expect(`${product2}`).toBe("콜라,1000,10,탄산2+1\n");
    })

    test("구매할 상품명과 프로모션 여부가 같으면 입력된 개수만큼 해당 상품 재고를 차감한다", () => {
        expect(product2.quantity).toBe(10);

        product2.purchase('콜라', 10, true);
        expect(product2.quantity).toBe(0);
    })

    test("구매할 상품명과 프로모션 여부가 같지 않으면 입력된 개수만큼 해당 상품 재고를 차감하지 않는다", () => {
        expect(product1.quantity).toBe(8);

        product1.purchase('콜라', 10, false);
        expect(product1.quantity).toBe(8);

        product1.purchase('사이다', 10, false);
        expect(product1.quantity).toBe(8);

        product1.purchase('사이다', 10, true);
        expect(product1.quantity).toBe(8);
    })
});
