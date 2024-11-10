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
            const { getMore, addIntention } = await this.checkDemandNumber(demandProduct, demandNumber);
            if (addIntention == "Y") {
                demandNumber += getMore;
            }

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

    async checkDemandNumber(demandProduct, demandNumber) {
        const demandPromotion = this.whatPromotion(demandProduct);

        const promotion = this.#promotions.find(promotion => promotion.findByName(demandPromotion));
        
        const getMore = promotion.calculateMore(demandNumber);
        if (getMore !== 0) {
            const addIntention = await this.#inputView.getMore(demandProduct, getMore);

            return { getMore, addIntention };
        }
        const addIntention = "N";

        return { getMore, addIntention };
    }

    whatPromotion(demandProduct) {
        const filtered = this.products.filter(product => product.name == demandProduct && product.promotion !== 'null');

        return filtered[0].promotion;
    }

    


}

export default Store;