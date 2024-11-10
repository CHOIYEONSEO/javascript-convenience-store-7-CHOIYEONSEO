import { Console } from "@woowacourse/mission-utils";

class InputView {

    async buy() {
        const message = "구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n"
        const input = await Console.readLineAsync(message);

        return input;
    }

    async getMore(product, number) {
        const message = `\n현재 ${product}은(는) ${number}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`;
        const input = await Console.readLineAsync(message);

        return input;
    }
}

export default InputView;