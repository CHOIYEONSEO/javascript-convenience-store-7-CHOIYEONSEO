import { DateTimes } from "@woowacourse/mission-utils";
import Promotion from "../src/Model/Promotion.js";

const TODAY_YEAR = DateTimes.now().getFullYear();
const TODAY_MONTH = DateTimes.now().getMonth() + 1;
const TODAY_DATE = DateTimes.now().getDate();

describe("Promotion 테스트", () => {
    test("오늘 날짜가 프로모션 기간 내에 포함된 경우에만 프로모션 이름을 반환한다", () => {
        const promotion1 = new Promotion("8일의할인", 1, 1, "2024-11-08", "2024-11-08");
        const promotion2 = new Promotion("9일의할인", 1, 1, "2024-11-09", "2024-11-09");

        expect(promotion1.availableDate()).toBe(undefined);
        expect(promotion2.availableDate()).toBe("9일의할인");
    })
})