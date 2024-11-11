import { Console } from "@woowacourse/mission-utils";

const PRODUCT_NAME_LENGTH = 15;
const NUMBER_LENGTH = 4;
const PRICE_LENGTH = 6;
const FILL_BY = "\t";

class OutputView {
    initial(products) {
        this.welcome();
        products.forEach(element => {
            this.stock(element.name, element.price, element.quantity, element.promotion);
        });
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

    printError(error) {
        Console.print(error.message);
    }

    printReceipt(products = [], free = [], price = []) {
        const header = "\n==============W 편의점================";
        Console.print(`${header}`);
        
        this.productsSummaryHeader();
        this.productsSummary(products);
        this.freeSummaryHeader();
        this.freeSummary(free);
        this.priceSummaryHeader();
        this.priceSummary(price);
    }

    productsSummaryHeader() {
        const productName = `${"상품명".padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
        const number = `${"수량".padEnd(NUMBER_LENGTH)}${FILL_BY}`;
        const price = `${"금액".padEnd(PRICE_LENGTH)}`;
        Console.print(`${productName}${number}${price}`);
    }

    productsSummary(array = []) {
        array.forEach((item) => {
            const productName = `${item[0].padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
            const number = `${String(item[1]).padEnd(NUMBER_LENGTH)}${FILL_BY}`;
            const price = `${(item[1]*item[2]).toLocaleString().padEnd(PRICE_LENGTH)}`;
            Console.print(`${productName}${number}${price}`);
        })
    }       

    freeSummaryHeader() {
        const header = "=============증	     정===============";
        Console.print(`${header}`);
    }

    freeSummary(array = []) {
        array.forEach((item) => {
            const productName = `${item[0].padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
            const number = `${String(item[1]).padEnd(NUMBER_LENGTH)}${FILL_BY}`;
            const price = `${"".padEnd(PRICE_LENGTH)}`;
            Console.print(`${productName}${number}${price}`);
        })
    }

    priceSummaryHeader() {
        const header = "======================================";
        Console.print(`${header}`);
    }

    priceSummary(price = []) {
        this.printTotalPrice(price[0], price[1]);
        this.printPromotion(price[2]);
        this.printMembership(price[3]);
        this.printFinalPrice(price[4]);
    }

    printTotalPrice(number, price) {
        const title = `${"총구매액".padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
        const totalNumber = `${String(number).padEnd(NUMBER_LENGTH)}${FILL_BY}`;
        const totalPrice = `${price.toLocaleString().padEnd(PRICE_LENGTH)}`;
        Console.print(`${title}${totalNumber}${totalPrice}`);
    }

    printPromotion(price) {
        const title = `${"행사할인".padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
        const number = `${"".padEnd(NUMBER_LENGTH)}${FILL_BY}`;
        const promotionPrice = `-${price.toLocaleString().padEnd(PRICE_LENGTH)}`;
        Console.print(`${title}${number}${promotionPrice}`);
    }

    printMembership(price) {
        const title = `${"멤버십할인".padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
        const number = `${"".padEnd(NUMBER_LENGTH)}${FILL_BY}`;
        const membershipPrice = `-${price.toLocaleString().padEnd(PRICE_LENGTH)}`;
        Console.print(`${title}${number}${membershipPrice}`);
    }

    printFinalPrice(price) {
        const title = `${"내실돈".padEnd(PRODUCT_NAME_LENGTH)}${FILL_BY}`;
        const number = `${"".padEnd(NUMBER_LENGTH)}${FILL_BY}`;
        const finalPrice = `${price.toLocaleString().padEnd(PRICE_LENGTH)}`;
        Console.print(`${title}${number}${finalPrice}`);
    }
}

export default OutputView;