import InputView from "./View/InputView.js";
import fs from "fs";
import Product from "./Model/Product.js";
import {Console} from "@woowacourse/mission-utils";

const PRODUCTS_FILE_PATH = "public/products.md";
const READ_OPTION = "utf-8";

class App {
    async run() {
        const productsData = this.readFile(PRODUCTS_FILE_PATH, READ_OPTION);
        const products = productsData.map((element) => {
            const splitElement = element.split(",");
            return new Product(...splitElement);
        })

        this.updateProducts(PRODUCTS_FILE_PATH, products);

        // const inputView = new InputView();
        // const input = await inputView.start(splitData);

    }

    readFile(path, option) {
        const data = fs.readFileSync(path, option);

        return data.split("\n").slice(1, -1);
    }

    updateProducts(path, products) {
        const data = ['name,price,quantity,promotion\n'];

        products.forEach(element => {
            data.push(`${element}`);
        })

        fs.writeFileSync(path, data.join(""));
    }
}


export default App;
