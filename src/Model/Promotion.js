import { DateTimes } from "@woowacourse/mission-utils";

const DELIMITER = "-";

class Promotion {
    name;
    #buy;
    #get;
    #startDate;
    #endDate;
    #today_year;
    #today_month;
    #today_date;

    constructor(name, buy, get, startDate, endDate) {
        this.name = name;
        this.#buy = Number(buy);
        this.#get = Number(get);
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#today_year = DateTimes.now().getFullYear();
        this.#today_month = DateTimes.now().getMonth() + 1;
        this.#today_date = DateTimes.now().getDate();
    }

    availableDate() {
        const { year, month, date } = this.splitDate(this.#startDate);

        if (this.#today_year >= year && this.#today_month >= month && this.#today_date >= date) {
            const { year, month, date } = this.splitDate(this.#endDate);

            if (this.#today_year <= year && this.#today_month <= month && this.#today_date <= date) {
                return this;
            }
        }
    }

    splitDate(value) {
        const splitValue = value.split(DELIMITER);
        const year = Number(splitValue[0]);
        const month = Number(splitValue[1]);
        const date = Number(splitValue[2]);

        return { year, month, date };
    }

    findByName(value) {
        if (this.name == value) {
            return this;
        }
    }

    calculateMore(value) {
        const remainder = value % (this.#buy + this.#get);
        let whatCase = "pass";
        let returnValue = remainder;

        if (remainder == this.#buy) {
            whatCase = "more";
            returnValue = this.#get;
        }

        return { whatCase, returnValue };
    }

    calculateStock(stock) {
        const total = this.#buy + this.#get;
        const remainder = stock % total;

        if (remainder == 0 || remainder == this.#buy) {
            return 0;
        }

        return remainder;
    }

    calculateFree(value) {
        const total = this.#buy + this.#get;
        const free = Math.floor(value / total) * this.#get;

        return free;
    }
}

export default Promotion;