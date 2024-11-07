import { Console } from "@woowacourse/mission-utils";

//개별 상품 사이 공백 허용x, 한글 상품명만 허용
const PURCHASES_FORMAT = /^\[([ㄱ-ㅎ가-힣]+)-(\d+)](?:,\[([ㄱ-ㅎ가-힣]+)-(\d+)])*$/;
const PURCHASE_FORMAT = /\[([ㄱ-ㅎ가-힣]+)-(\d+)]/g;

class Validator {
    constructor(parameters) { }

    purchaseInput(input) {
        let formattedInput = this.checkFormat(input);

        return formattedInput;
    }

    checkFormat(input) {
        if (PURCHASES_FORMAT.test(input)) {
            const matches = [...input.matchAll(PURCHASE_FORMAT)];

            return matches.map(match => [match[1], Number(match[2])]);
        } else {
            const errorMessage = `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`;
            throw new Error(errorMessage);
        }
    }
}

export default Validator;