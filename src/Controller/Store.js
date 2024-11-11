import InputView from "../View/InputView.js";
import OutputView from "../View/OutputView.js";
import Validator from "../Model/Validator.js";
import Receipt from "../Model/Receipt.js";
import updateFile from "../Model/updateFile.js";

const PRODUCTS_FILE_PATH = "public/products.md";
const VALIDATE = new Validator();

class Store {
    #inputView;
    #outputView;
    products;
    #promotions;
    #receipt;

    constructor(products, promotions, inputView = new InputView(), outputView = new OutputView(), receipt = new Receipt()) {
        this.#inputView = inputView;
        this.#outputView = outputView;
        this.products = products;
        this.#promotions = promotions;
        this.#receipt = receipt;
    }

    async open() {
        this.#outputView.initial(this.products);
        const demand = await this.getPurchaseInput();

        for (const element of demand) {
            await this.purchase(element);
        }

        await this.membership();
        this.getReceipt();
        const additionalPurchase = await this.additionalPurchase();

        return additionalPurchase;
    }

    // 구매할 수량 입력
    async getPurchaseInput() {
        while (true) {
            let input = await this.#inputView.buy(); // input = [[],..]

            try {
                input = VALIDATE.purchaseInput(input); // 구매할 수량 형식 맞는지 확인
                this.checkValidPurchase(input, this.products); // 존재하는 상품명인지 구매할 수량이 총재고((프로모션재고)+일반재고)를 넘지 않는지 확인

                return input;
            } catch (error) {
                this.#outputView.printError(error);
            }
        }
    }

    checkValidPurchase(inputs = [], targets = []) {
        inputs.forEach((input) => { // 모든 인풋에 대해 확인
            // 존재하는 상품명인지 확인
            const inputName = input[0];
            const foundProducts = this.checkValidName(inputName, targets);

            // 수량이 (프로모션 0) 프로모션재고 + 일반재고 / (프로모션 x) 일반재고 넘는지 확인
            const inputNumber = input[1];
            this.checkOverStock(inputNumber, foundProducts);
        })
    }

    checkValidName(name, targets = []) {
        const foundTargets = targets.filter(target => target.isExistence(name)); // 인풋이 상품 배열에 없으면 빈 배열 반환

        if (foundTargets.length === 0) {
            const errorMessage = `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`;
            throw new Error(errorMessage);
        }

        return foundTargets;
    }

    checkOverStock(input, targets = []) {
        const stockNumber = targets.reduce((acc, cur) => {
            return acc + cur.quantity;
        }, 0);

        if (input > stockNumber) {
            const errorMessage = `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`;
            throw new Error(errorMessage);
        }
    }
    // 구매할 수량 입력 끝

    // 구매 시작
    async purchase(input) {
        const demandProduct = input[0];
        let demandNumber = input[1];

        const condition = this.isPromotion(demandProduct); // 프로모션 상품인지 확인
        const targetProducts = this.products.filter(target => target.isExistence(demandProduct)); // 프로모션 상품, 일반 상품 모두 찾기

        if (targetProducts.length == 2) {
            // 프로모션 상품이 있을 때
            return await this.purchasePromotion(targetProducts, demandNumber);
        }

        return this.purchaseProduct(demandProduct, demandNumber, condition);
    }

    async purchasePromotion(targetProducts, demandNumber) { // 프로모션 상품 구매하려는 상황
        const purchaseNumber = await this.checkPromotionStock(targetProducts, demandNumber); // 프로모션 재고가 부족해서 원가 결제 해야하는지 확인
        const promotionStock = targetProducts[0].quantity;
        const demandProduct = targetProducts[0].name;

        if (promotionStock < purchaseNumber) {
            targetProducts[0].purchase(demandProduct, promotionStock, true);
            targetProducts[1].purchase(demandProduct, purchaseNumber - promotionStock, false);
            this.#receipt.setProducts(demandProduct, purchaseNumber, targetProducts[0].price);
            return this.freeSummary(targetProducts[0], promotionStock);
        }

        return this.purchaseProduct(demandProduct, purchaseNumber, true);
    }

    purchaseProduct(demandProduct, demandNumber, condition) {
        const targetProduct = this.products.find((product) => product.find(demandProduct, condition));
        targetProduct.purchase(demandProduct, demandNumber, condition);
        this.#receipt.setProducts(demandProduct, demandNumber, targetProduct.price);

        if (condition) {
            this.freeSummary(targetProduct, demandNumber);
            return;
        }
        this.regularSummary(targetProduct, demandNumber);
    }

    freeSummary(product, demandNumber) {
        const promotion = this.#promotions.find(promotion => promotion.findByName(product.promotion));
        const freeNumber = promotion.calculateFree(demandNumber);

        this.#receipt.setFree(product.name, freeNumber, product.price);
    }

    async checkPromotionStock(targetProducts, demandNumber) {
        const promotionStock = targetProducts[0].quantity;
        const demandPromotion = targetProducts[0].promotion;
        // 총 개수 넘길 수 있음
        const promotionElement = this.#promotions.find(promotion => promotion.findByName(demandPromotion));

        // 프로모션 재고가 원하는 수량보다 부족하면 정가 결제로 안내
        if (promotionStock < demandNumber) {
            return await this.lackStock(promotionElement, promotionStock, targetProducts[0].name, demandNumber); // 검증 끝
        }

        return await this.properStock(promotionElement, promotionStock, targetProducts[0].name, demandNumber);
    }

    async lackStock(promotion, promotionStock, demandProduct, demandNumber) {
        const remainder = promotion.calculateStock(promotionStock);
        const overNumber = demandNumber - promotionStock + remainder;
        const purchaseNumber = await this.askApplyRegular(demandProduct, overNumber, demandNumber); // 정가 결제 의사에 따른 구매 개수

        return purchaseNumber;
    }

    async properStock(promotion, promotionStock, demandProduct, demandNumber) { // 한번더 재고 넘지 않는지 확인할 필요 있음. 검증 완료
        const { whatCase, returnValue } = await promotion.calculateMore(demandNumber);
        const purchaseNumber = await this.checkCase(whatCase, returnValue, promotionStock, demandProduct, demandNumber);

        return purchaseNumber;
    }

    async checkCase(whatCase, returnValue, promotionStock, product, demandNumber) {
        switch (whatCase) {
            case "more":
                const afterGetMore = demandNumber + returnValue;
                if (afterGetMore > promotionStock) { // 프로모션 재고 넘어가므로 증정품 추가 할 수 없는 상황
                    return demandNumber;
                }

                const getMore = await this.getValidMore(product, returnValue);
                if (getMore == "Y") {
                    return afterGetMore;
                }

                return demandNumber;
            case "regular":
                const purchaseNumber = await this.askApplyRegular(product, returnValue, demandNumber);

                return purchaseNumber;
            default:
                return demandNumber;
        }
    }

    async getValidMore(product, moreNumber) {
        while (true) {
            let getMore = await this.#inputView.getMore(product, moreNumber);

            try {
                return VALIDATE.intention(getMore);
            } catch (error) {
                this.#outputView.printError(error);
            }
        }
    }

    async askApplyRegular(product, overNumber, purchaseNumber) {
        const applyRegular = await this.getValidRegular(product, overNumber); // 유효한 정가 결제 의사

        if (applyRegular == "N") { // 정가 결제 안함
            return purchaseNumber - overNumber;
        }

        this.#receipt.setRegular(product, overNumber);
        return purchaseNumber; // 정가 결제 함
    }

    async getValidRegular(product, overNumber) {
        while (true) {
            const applyRegular = await this.#inputView.applyRegular(product, overNumber);

            try {
                return VALIDATE.intention(applyRegular);
            } catch (error) {
                this.#outputView.printError(error);
            }
        } // 유효할 때 까지 입력
    }

    isPromotion(purchaseProduct) {
        const filtered = this.products.filter(product => product.name == purchaseProduct);

        const isPromotion = filtered.some((filter) => {
            if (filter.promotion !== 'null') {
                return true;
            }
            return false;
        })

        return isPromotion;
    }

    async membership() {
        const input = await this.getValidMembership();
        this.#receipt.setPrice(input);
    }

    async getValidMembership() {
        while (true) {
            let input = await this.#inputView.applyMembership();

            try {
                return VALIDATE.intention(input);
            } catch (error) {
                this.#outputView.printError(error);
            }
        }
    }

    getReceipt() {
        const productsSummary = this.#receipt.getProducts();
        const freeSummary = this.#receipt.getFree();
        const priceSummary = this.#receipt.getPrice();

        this.#outputView.printReceipt(productsSummary, freeSummary, priceSummary);
    }

    async additionalPurchase() {
        const input = await this.getValidAdditional();
        updateFile(PRODUCTS_FILE_PATH, this.products);

        return input;
    }

    async getValidAdditional() {
        while (true) {
            let input = await this.#inputView.additional();

            try {
                return VALIDATE.intention(input);
            } catch (error) {
                this.#outputView.printError(error);
            }
        }
    }

    regularSummary(product, demandNumber) {
        if (product.promotion == "null") {
            this.#receipt.setRegular(product.name, demandNumber);
        }
    }

    whatPromotion(demandProduct) {
        const filtered = this.products.filter(product => product.name == demandProduct && product.promotion !== 'null');

        return filtered[0].promotion;
    }

    calculatePromotionStock(demandProduct) {
        const filtered = this.products.filter(product => product.name == demandProduct && product.promotion !== 'null');

        return filtered[0].quantity;
    }
}

export default Store;