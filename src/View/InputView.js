import { Console } from "@woowacourse/mission-utils";

class InputView {

    async buy() {
        const message = "구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n"
        const input = await Console.readLineAsync(message);

        return input;
    }
}

export default InputView;