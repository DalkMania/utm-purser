import Pageviews from "../PageViews";
import UTMPurser from "../index";

jest.useFakeTimers("modern").setSystemTime(new Date("2019-10-30").getTime());

describe("Pageviews", () => {
    beforeEach(() => {
        delete window.location;
        window.location = {
            toString: () =>
                "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_tem=term",
            origin: "http://example.com",
            pathname: "/"
        };
        UTMPurser.create();
    });

    describe("Pageviews.add()", () => {
        it(`It increments the pageview count`, () => {
            window.location = {
                toString: () => "http://example.com/other-page",
                origin: "http://example.com/other-page",
                pathname: "/"
            };

            const expected = {
                referrer: "direct",
                browser_timezone: 0,
                browser_language: "en-US",
                landing_page: "http://example.com/",
                last_visit: 1572393600,
                pageviews: 2,
                first_website_visit: "2019-10-30T00:00:00.000Z",
                screen_height: 0,
                screen_width: 0,
                utm_source: "example",
                utm_medium: "medium",
                utm_campaign: "campaign",
                utm_content: "content",
                utm_name: "name"
            };

            expect(Pageviews.add()).toStrictEqual(expected);
        });
    });
});
