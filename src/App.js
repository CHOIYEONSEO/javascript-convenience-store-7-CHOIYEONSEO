import fs from "fs";
import Product from "./Model/Product.js";

const PRODUCTS_FILE_PATH = "public/products.md";
const READ_OPTION = "utf-8";

class App {
    async run() {
        const productsData = this.readFile(PRODUCTS_FILE_PATH, READ_OPTION);
        const products = productsData.map((element) => {
            const splitElement = element.split(",");
            return new Product(...splitElement);
        })


    }

    readFile(path, option) {
        const data = fs.readFileSync(path, option);

        return data.split("\n").slice(1, -1);
    }
}


export default App;
