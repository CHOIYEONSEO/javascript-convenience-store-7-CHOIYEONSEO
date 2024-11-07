import Validator from "../src/Model/Validator.js";

const validate = new Validator();

describe("Validator 테스트", () => {
    test.each(["[사이다-2]", "[사이다-2],[감자칩-1]"])("구매하고 싶은 값 %s는 -, [], ,로 잘 구분되어 그 값을 반환한다.", (condition) => {
        expect(validate.checkFormat(condition)).toBe(condition);
    });

    test.each(["사이다", "2", "사이다-", "사이다-2", "[사이다]", "[사이다-2", "사이다2", "[사이다-2][감자칩-1]"])("구매하고 싶은 값 %s는 잘못된 형식으로 에러 처리한다.", (condition) => { 
        expect(() => validate.checkFormat(condition)).toThrow("[ERROR]");
    });


    



});