import Visits from "../Visits";
import UTMPurser from "../index";

jest.useFakeTimers("modern").setSystemTime(new Date("2019-10-30").getTime());

describe("Visits", () => {
    beforeEach(() => {
        delete window.location;
    });

    describe("UTMPurser.create()", () => {
        it(`It creates a Purser Visitor Object with UTM params based on a real URL`, () => {
            window.location = {
                toString: () =>
                    "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_tem=term",
                origin: "http://example.com",
                pathname: "/"
            };

            const expected = {
                referrer: "direct",
                browser_timezone: 0,
                browser_language: "en-US",
                landing_page: "http://example.com/",
                last_visit: 1572393600,
                pageviews: 1,
                first_website_visit: "2019-10-30T00:00:00.000Z",
                screen_height: 0,
                screen_width: 0,
                utm_source: "example",
                utm_medium: "medium",
                utm_campaign: "campaign",
                utm_content: "content",
                utm_name: "name"
            };

            expect(UTMPurser.create()).toStrictEqual(expected);
        });
    });

    describe("Visits.recently()", () => {
        it(`It returns true when less than 30 minutes has passed`, () => {
            const mockDate = new Date(1572394680000);
            const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);
            expect(Visits.recently()).toBe(true);
            spy.mockRestore();
        });

        it(`It returns false when more than 30 minutes has passed`, () => {
            const mockDate = new Date(1572397080000);
            const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);
            expect(Visits.recently()).toBe(false);
            spy.mockRestore();
        });
    });
});
