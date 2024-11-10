class Receipt {
    #products; // array[[상품명, 수량, 금액]]
    #free; // array[[상품명, 수량, 금액]]
    //#price; // array[총구매액, 행사할인, 멤버십할인, 내실돈]


    constructor() {
        this.#products = [];
        this.#free = [];
        //this.#price = setPrice();
    }

    setProducts(name, number, price) {
        this.#products.push([name, number, price]);
    }

    getProducts() {
        return this.#products;
    }

    setFree(name, number, price) {
        if (number > 0) {
            this.#free.push([name, number, price]);
        }
    }

    getFree() {
        return this.#free;
    }

    setPrice() {

    }
}

export default Receipt;