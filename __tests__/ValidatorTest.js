import Validator from "../src/Model/Validator.js";

const validate = new Validator();

describe("Validator 테스트", () => {
    test("구매하고 싶은 값이 -, [], ,로 잘 구분되어 [상품명, 수량]으로 반환한다.", () => {
        const passInput = ["[사이다-2]", "[사이다-2],[감자칩-1]"];
        
        expect(validate.checkFormat(passInput[0])).toEqual([["사이다", 2]]);
        expect(validate.checkFormat(passInput[1])).toEqual([["사이다", 2], ["감자칩", 1]]);
    });

    test.each(["사이다", "2", "사이다-", "사이다-2", "[사이다]", "[사이다-2", "사이다2", 
               "[사이다-2][감자칩-1]", "[사이다-2],", "[사이다-2],[감자칩-2"])("구매하고 싶은 값 %s는 잘못된 형식으로 에러 처리한다.", (condition) => { 
        expect(() => validate.checkFormat(condition)).toThrow("[ERROR]");
    });

    test.each([" ", "\n", "y", "n", "네"])("사용자에게 의사를 입력받는 경우 Y 또는 N이 아닌 '%s'를 입력하면 에러가 발생한다", (condition) => {
        expect(() => validate.intention(condition)).toThrow("[ERROR]"); 
    });
    
});