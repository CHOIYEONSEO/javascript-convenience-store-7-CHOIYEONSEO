import { Console } from "@woowacourse/mission-utils";

class OutputView {
    blankLine() {
        Console.print("");
    }

    initial(products) {
        this.welcome();
        products.forEach(element => {
            this.stock(element.name, element.price, element.quantity, element.promotion);
        });
        this.blankLine();
    }

    welcome() {
        const message = "안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n";
        Console.print(message);
    }

    stock(name, price, quantity, promotion) {
        const formattedPrice = price.toLocaleString();
        const message = this.stockMessage(name, formattedPrice, quantity, promotion);

        Console.print(message);
    }

    stockMessage(name, price, quantity, promotion) {
        if (quantity == 0) {
            promotion = this.promotionMessage(promotion);

            return `- ${name} ${price}원 재고 없음 ${promotion}`;
        }

        promotion = this.promotionMessage(promotion);
        
        return `- ${name} ${price}원 ${quantity}개 ${promotion}`;
    }

    promotionMessage(promotion) {
        if (promotion == 'null') {
            return "";
        }
        return promotion;
    }

}

export default OutputView;