import InputView from "./View/InputView.js";
import Product from "./Model/Product.js";
import {Console} from "@woowacourse/mission-utils";
import Store from "./Controller/Store.js";
import readFile from "./Model/readFile.js";
//import promotionManage from "./Model/promotionManage.js";

const PRODUCTS_FILE_PATH = "public/products.md";
const PROMOTIONS_FILE_PATH = "public/promotions.md";
const READ_OPTION = "utf-8";

class App {
    async run() {
        const productsData = readFile(PRODUCTS_FILE_PATH, READ_OPTION);
        const promotionsData = readFile(PROMOTIONS_FILE_PATH, READ_OPTION);
        const products = productsData.map((element) => {
            const splitElement = element.split(",");
            return new Product(...splitElement);
        })

        const store = new Store(products);
        store.open();

        //updateProducts(PRODUCTS_FILE_PATH, products);

        // const inputView = new InputView();
        // const input = await inputView.start(splitData);

    }
}


export default App;
