import fs from "fs";
import Products from "../Model/Product.js";
//import InputView from "../View/InputView.js";
import OutputView from "../View/OutputView.js";



class Store {
    //#inputView;
    #outputView;
    products;

    constructor(products) {
        //this.#inputView = new InputView();
        this.#outputView = new OutputView();
        this.products = products;
    }

    open() {
        this.#outputView.initial(this.products);
    }


}

export default Store;