class Product {
    name;
    price;
    quantity;
    promotion;

    constructor(name, price, quantity, promotion) {
        this.name = name;
        this.price = Number(price);
        this.quantity = Number(quantity);
        this.promotion = promotion;
    }

    decreaseQuantity(value) {
        this.quantity -= value;
    }

    toString() {
        return `${this.name},${this.price},${this.quantity},${this.promotion}\n`;
    }

    isExistence(input) {
        return this.name === input;
    }

    purchase(purchaseProduct, purchaseNumber, isPromotion) {
        const condition = this.promotion !== 'null';

        if (this.name == purchaseProduct && condition == isPromotion) {
            this.decreaseQuantity(purchaseNumber);
        }
    }

    findByName(value) {
        if (this.name == value) {
            return this;
        }
    }

    // isPromotion : 프로모션 적용이면 true / 아니면 false
    find(name, isPromotion) {
        const condition = this.promotion !== 'null' // 프로모션 적용이면 true / 아니면 false

        if (this.name == name && condition == isPromotion) {
            return this;
        }
    }


}

export default Product;