import { Console } from "@woowacourse/mission-utils";

class Validator {
    constructor(parameters) {}

    purchaseInput(input) {

        //개별 상품 사이 공백 허용x, 한글 상품명만 허용
        const regex = /^\[([ㄱ-ㅎ가-힣]+)-(\d+)](?:,\[([ㄱ-ㅎ가-힣]+)-(\d+)])*$/;
        if (regex.test(input)) {
            const match = input.match(regex);
            return match[0];
        } else {
            const errorMessage = `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`; // OutputView로 빼기?
            throw new Error(errorMessage);
        }
    }
}

export default Validator;