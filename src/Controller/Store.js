import fs from "fs";
import Products from "../Model/Product.js";
import InputView from "../View/InputView.js";
import OutputView from "../View/OutputView.js";
import Validator from "../Model/Validator.js";
import {Console} from "@woowacourse/mission-utils";

class Store {
    #inputView;
    #outputView;
    products;
    #promotions;

    constructor(products, promotions, inputView = new InputView(), outputView = new OutputView(), ) {
        this.#inputView = inputView;
        this.#outputView = outputView;
        this.products = products;  // 리팩토링 시 app.js에 있는 products[] 생성 코드 여기로 가져오기
        this.#promotions = promotions;
    }

    async open() {
        this.#outputView.initial(this.products);
        const demand = await this.getPurchaseInput();
        
        for (const element of demand) {
            await this.purchase(element);
        }
        
    }

    async getPurchaseInput() {
        while (true) {
            let input = await this.#inputView.buy();

            try {
                // 유효성 체크
                const validate = new Validator();
                input = validate.purchaseInput(input);

                this.checkExistence(input, this.products);
                


                return input;

            } catch (error) {
                this.#outputView.printError(error);
            }
        }
    }

    // 함수 10줄 넘어감.
    checkExistence(inputs = [], targets = []) {
        inputs.forEach((input) => {
            const inputName = input[0];
            const foundInput = targets.filter((target) => { 
                return target.isExistence(inputName);
            })

            if (foundInput.length === 0) {
                const errorMessage = `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`;
                throw new Error(errorMessage);
            }

            this.checkOverStock(input[1], foundInput);
        })
            
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

    async purchase(input) {
        const demandProduct = input[0];
        let demandNumber = input[1];

        const condition = this.isPromotion(demandProduct);

        if (condition) {
            demandNumber = await this.checkPromotionStock(demandProduct, demandNumber);
        }

        this.products.forEach((product) => {
            product.purchase(demandProduct, demandNumber, condition);
        })

    }

    isPromotion(purchaseProduct) { //isPromotion? whatPromotion?
        const filtered = this.products.filter(product => product.name == purchaseProduct);
        
        const isPromotion = filtered.some((filter) => {
            if (filter.promotion !== 'null') {
                return true;
            }
            return false;
        })

        return isPromotion;
    }

    async checkPromotionStock(demandProduct, demandNumber) {
        const promotionStock = this.calculatePromotionStock(demandProduct);

        const demandPromotion = this.whatPromotion(demandProduct); // checkDemandNumber과 중복
        const promotion = this.#promotions.find(promotion => promotion.findByName(demandPromotion)); // checkDemandNumber과 중복

        if (promotionStock < demandNumber) {
            return await this.lackStock(promotion, promotionStock, demandProduct, demandNumber);
        }

        return await this.properStock(demandProduct, demandNumber);
    }

    async lackStock(promotion, promotionStock, demandProduct, demandNumber) {
        const remainder = promotion.calculateStock(promotionStock);
        const overNumber = demandNumber - promotionStock + remainder;

        const purchaseNumber = await this.askApplyRegular(demandProduct, overNumber, demandNumber);
        
        return purchaseNumber;
    }

    async properStock(demandProduct, demandNumber) {
        const { whatCase, returnValue } = await this.checkDemandNumber(demandProduct, demandNumber);

        const purchaseNumber = await this.checkCase(whatCase, returnValue, demandProduct, demandNumber);

        return purchaseNumber;
    }

    async checkDemandNumber(demandProduct, demandNumber) {
        const demandPromotion = this.whatPromotion(demandProduct);

        const promotion = this.#promotions.find(promotion => promotion.findByName(demandPromotion));
        
        return promotion.calculateMore(demandNumber);
    }

    whatPromotion(demandProduct) {
        const filtered = this.products.filter(product => product.name == demandProduct && product.promotion !== 'null');

        return filtered[0].promotion;
    }

    calculatePromotionStock(demandProduct) {
        const filtered = this.products.filter(product => product.name == demandProduct && product.promotion !== 'null');

        return filtered[0].quantity;
    }

    async checkCase(whatCase, returnValue, product, demandNumber) {
        switch (whatCase) {
            case "more":
                const getMore = await this.#inputView.getMore(product, returnValue); // askGetMore도 분리하기

                if (getMore == "Y") {
                    return demandNumber += returnValue; // 재고 넘는지 체크
                }

                return demandNumber;
            case "regular":
                const purchaseNumber = await this.askApplyRegular(product, returnValue, demandNumber);

                return purchaseNumber;
            default:
                return demandNumber;
        }
    }

    async askApplyRegular(product, overNumber, purchaseNumber) {
        const applyRegular = await this.#inputView.applyRegular(product, overNumber);

        if (applyRegular == "N") {
            return purchaseNumber - overNumber;
        }

        return purchaseNumber;
    }
    


}

export default Store;