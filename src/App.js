import InputView from "./View/InputView.js";
import Product from "./Model/Product.js";
import {Console} from "@woowacourse/mission-utils";
import Store from "./Controller/Store.js";
import readFile from "./Model/readFile.js";
import Promotion from "./Model/Promotion.js";

const PRODUCTS_FILE_PATH = "public/products.md";
const PROMOTIONS_FILE_PATH = "public/promotions.md";
const READ_OPTION = "utf-8";
const DELIMITER = ",";

class App {
    async run() {
        const productsData = readFile(PRODUCTS_FILE_PATH, READ_OPTION);
        const promotionsData = readFile(PROMOTIONS_FILE_PATH, READ_OPTION);

        const promotions = promotionsData.map((element) => {
            const splitElement = element.split(DELIMITER);

            return new Promotion(...splitElement);
        });

        const availablePromotion = promotions.map((promotion) => {
            return promotion.availableDate();
        });

        availablePromotion.push("null");

        const products = productsData.map((element) => {
            const splitElement = element.split(",");

            const isInclude = availablePromotion.some(available => available.name == splitElement[3] || available == splitElement[3]);

            if (isInclude) {
                return new Product(...splitElement);
            }
        }).filter(element => element);

        const store = new Store(products, availablePromotion);
        store.open();

        //updateProducts(PRODUCTS_FILE_PATH, products);

        // const inputView = new InputView();
        // const input = await inputView.start(splitData);

    }
}


export default App;
