import fs from "fs";
import Products from "../Model/Product.js";
import InputView from "../View/InputView.js";
import OutputView from "../View/OutputView.js";
import Validator from "../Model/Validator.js";



class Store {
    #inputView;
    #outputView;
    products;

    constructor(products) {
        this.#inputView = new InputView();
        this.#outputView = new OutputView();
        this.products = products;
    }

    async open() {
        this.#outputView.initial(this.products);
        const purchase = await this.getPurchaseInput();
    }

    async getPurchaseInput() {
        //while (true) {
            let input = await this.#inputView.buy();

            try {
                // 유효성 체크
                const validate = new Validator();
                validate.purchaseInput(input);

                return input;

            } catch (error) {
                // 에러 메시지 출력
            }
        //}
    }


}

export default Store;