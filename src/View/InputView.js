import { Console } from "@woowacourse/mission-utils";

class InputView {

    async buy() {
        const message = "\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n"
        const input = await Console.readLineAsync(message);

        return input;
    }

    async getMore(product, number) {
        const message = `\n현재 ${product}은(는) ${number}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`;
        const input = await Console.readLineAsync(message);

        return input;
    }

    async applyRegular(product, number) {
        const message = `\n현재 ${product} ${number}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`;
        const input = await Console.readLineAsync(message);

        return input;
    }

    async applyMembership() {
        const message = `\n멤버십 할인을 받으시겠습니까? (Y/N)\n`;
        const input = await Console.readLineAsync(message);

        return input;
    }

    async additional() {
        const message = `\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n`;
        const input = await Console.readLineAsync(message);

        return input;
    }
}

export default InputView;