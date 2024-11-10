import { DateTimes } from "@woowacourse/mission-utils";

const TODAY_YEAR = DateTimes.now().getFullYear();
const TODAY_MONTH = DateTimes.now().getMonth() + 1;
const TODAY_DATE = DateTimes.now().getDate();
const DELIMITER =  "-";

class Promotion {
    name;
    #buy;
    #get;
    #startDate;
    #endDate;

    constructor(name, buy, get, startDate, endDate) {
        this.name = name;
        this.#buy = Number(buy);
        this.#get = Number(get);
        this.#startDate = startDate;
        this.#endDate = endDate;
    }

    availableDate() {
        const {year, month, date} = this.splitDate(this.#startDate);
        
        if (TODAY_YEAR >= year && TODAY_MONTH >= month && TODAY_DATE >= date) {
            const {year, month, date} = this.splitDate(this.#endDate);

            if (TODAY_YEAR <= year && TODAY_MONTH <= month && TODAY_DATE <= date) {
                return this;
            }
        }
    }

    splitDate(value) {
        const splitValue = value.split(DELIMITER);
        const year = Number(splitValue[0]);
        const month = Number(splitValue[1]);
        const date = Number(splitValue[2]);

        return {year, month, date};
    }

    findByName(value) {
        if (this.name == value) {
            return this;
        }
    }

    calculateMore(value) {
        const total = this.#buy + this.#get;
        const remainder = value % total;

        if (value < this.#buy) {
            return 0;
        }

        if (remainder !== 0) {
            return total - remainder;
        }

        return 0;
    }
}

export default Promotion;