import promotionManage from "../src/Model/promotionManage.js";

const promotionsData = ["탄산2+1,2,1,2024-01-01,2024-12-31", "MD추천상품,1,1,2024-11-01,2024-11-05"]

describe("promotionManage 테스트", () => {
    test("오늘 날짜가 프로모션 기간 내에 포함된 경우에만 true를 반환한다", () => {
        expect(promotionManage(promotionsData)).toEqual(["탄산2+1", "null"]);
    })
})