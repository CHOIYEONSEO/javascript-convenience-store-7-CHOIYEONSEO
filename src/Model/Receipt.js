const MEMBERSHIP_PERCENT = 0.3;

class Receipt {
    #products; // array[[상품명, 수량, 금액]]
    #free; // array[[상품명, 수량, 금액]]
    #regular; // array[[상품명, 수량]] : 프로모션 미적용 구매상품
    #price; // array[총구매수량, 총구매액, 행사할인, 멤버십할인, 내실돈]

    constructor() {
        this.#products = [];
        this.#free = [];
        this.#regular = [];
        this.#price = [];
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

    setRegular(name, number) {
        this.#regular.push([name, number]);
    }

    getRegular() {
        return this.#regular;
    }

    setPrice(membershipIntention) {
        const totalNumber = this.getTotalNumber();
        const totalPrice = this.getTotalPrice();
        const promotionPrice = this.getPromotionPrice();
        const membershipPrice = this.setMembershipPrice(membershipIntention);
        const finalPrice = totalPrice - promotionPrice - membershipPrice;

        this.#price.push(totalNumber, totalPrice, promotionPrice, membershipPrice, finalPrice);
    }

    getPrice() {
        return this.#price;
    }

    getTotalNumber() {
        const totalNumber = this.#products.reduce((acc, cur) => {
            return acc + cur[1];
        }, 0);

        return totalNumber;
    }

    getTotalPrice() {
        const totalPrice = this.#products.reduce((acc, cur) => {
            return acc + cur[1] * cur[2];
        }, 0);

        return totalPrice;
    }

    getPromotionPrice() {
        const promotionPrice = this.#free.reduce((acc, cur) => {
            return acc + cur[1] * cur[2];
        }, 0);

        return promotionPrice;
    }

    setMembershipPrice(intention) {
        if (intention == "Y") {
            return this.getMembershipPrice();
        }

        return 0;
    }

    getMembershipPrice() {
        const membershipPrice = this.getRegularPrice() * MEMBERSHIP_PERCENT;

        if (membershipPrice > 8000) {
            return 8000;
        }

        return membershipPrice;
    }

    getRegularPrice() {
        const regularPrice = this.#regular.reduce((acc, cur) => {
            const price = this.findByName(cur[0])[2];
            return acc + cur[1] * price;
        }, 0);

        return regularPrice;
    }

    findByName(name) {
        const found = this.#products.find((product) => {
            if (product[0] == name) {
                return product;
            }
        })

        return found;
    }
}

export default Receipt;