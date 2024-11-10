import Promotion from "../src/Model/Promotion.js";

const promotion1 = new Promotion("10월의할인", 1, 1, "2024-10-01", "2024-10-31");
const promotion2 = new Promotion("11월의할인", 1, 1, "2024-11-01", "2024-11-30");
const promotion3 = new Promotion("2024년의할인", 2, 1, "2024-01-01", "2024-12-31");

describe("Promotion 테스트", () => {
    test("오늘 날짜가 프로모션 기간 내에 포함된 경우에만 프로모션 이름을 반환한다", () => {
        expect(promotion1.availableDate()).toBe(undefined);
        expect(promotion2.availableDate()).toEqual({"name": "11월의할인"});
    })

    test.each(["10월의 할인", "11월의 할인"])("프로모션 이름이 %s이면 해당 프로모션을 반환한다", (condition) => {
        if (promotion1.name == condition) {
            expect(promotion1.findByName(condition)).toEqual({"name": "10월의할인"});
            expect(promotion2.findByName(condition)).toBe(undefined);
        }
        
        if (promotion2.name == condition) {
            expect(promotion1.findByName(condition)).toBe(undefined);
            expect(promotion2.findByName(condition)).toEqual({"name": "11월의할인"});
        }
    })

    test.each([1, 3, 5])("1+1 할인일때 %s개를 가져오면 1개를 덜 가져왔으므로 1을 반환한다", (condition) => {
        expect(promotion1.calculateMore(condition)).toBe(1);
    })

    test.each([2, 4])("1+1 할인일때 %s개를 가져오면 적절한 수량을 가져왔으므로 0을 반환한다", (condition) => {
        expect(promotion1.calculateMore(condition)).toBe(0);
    })

    test.each([4, 7])("2+1 할인일때 %s개를 가져오면 2개를 덜 가져왔으므로 2를 반환한다", (condition) => {
        expect(promotion3.calculateMore(condition)).toBe(2);
    })

    test.each([2, 5, 8])("2+1 할인일때 %s개를 가져오면 1개를 덜 가져왔으므로 1을 반환한다", (condition) => {
        expect(promotion3.calculateMore(condition)).toBe(1);
    })

    test.each([3, 6])("2+1 할인일때 %s개를 가져오면 적절한 수량을 가져왔으므로 0을 반환한다", (condition) => {
        expect(promotion3.calculateMore(condition)).toBe(0);
    })

    test.each([1])("2+1 할인일때 %s개를 가져오면 더 가져올 수량이 없으므로 0을 반환한다", (condition) => {
        expect(promotion3.calculateMore(condition)).toBe(0);
    })
})