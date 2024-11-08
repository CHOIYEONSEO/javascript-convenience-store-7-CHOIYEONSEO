import { DateTimes } from "@woowacourse/mission-utils";

const TODAY_YEAR = DateTimes.now().getFullYear();
const TODAY_MONTH = DateTimes.now().getMonth() + 1;
const TODAY_DATE = DateTimes.now().getDate();

export default function promotionManage(promotionsData) {
    const promotions = promotionsData.map((element) => {
        const splitElement = element.split(",");
        const name = splitElement[0];
        const startDate = splitElement[3].split("-");
        const endDate = splitElement[4].split("-");
        if (checkAvailable(startDate, endDate)) {
            return name;
        }
    }).filter(element => element);

    promotions.push("null");

    return promotions;
}

// function이 적절한가?
function checkAvailable(startDate, endDate) {


    return TODAY_YEAR >= Number(startDate[0]) && TODAY_MONTH >= Number(startDate[1]) && TODAY_DATE >= Number(startDate[2]) && TODAY_YEAR <= Number(endDate[0]) && TODAY_MONTH <= Number(endDate[1]) && TODAY_DATE <= Number(endDate[2]);
}
