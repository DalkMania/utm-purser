import UTMPurser from "../index";

/**
 * @jest-environment jsdom
 */

jest.useFakeTimers("modern").setSystemTime(new Date("2019-10-30").getTime());

describe("UTMPurser", () => {
    beforeEach(() => {
        delete window.location;
    });

    describe("UTMPurser.create()", () => {
        it(`It creates a Purser Visitor Object with UTM params based on a real URL`, () => {
            window.location = {
                toString: () =>
                    "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_term=term",
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
                utm_name: "name",
                utm_term: "term"
            };

            expect(UTMPurser.create()).toStrictEqual(expected);
        });

        it(`It creates a Purser Visitor Object without UTM params based on a real URL without UTM params`, () => {
            window.location = {
                toString: () => "http://example.com",
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
                screen_width: 0
            };

            expect(UTMPurser.create()).toStrictEqual(expected);
        });
    });

    describe("UTMPurser.parseUTM()", () => {
        it(`Get proper UTM params based on real URL`, () => {
            window.location = {
                toString: () =>
                    "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_term=term",
                origin: "http://example.com",
                pathname: "/"
            };

            const expected = {
                utm_source: "example",
                utm_medium: "medium",
                utm_campaign: "campaign",
                utm_content: "content",
                utm_name: "name",
                utm_term: "term"
            };

            expect(UTMPurser.parseUTM()).toEqual(expect.objectContaining(expected));
        });

        it(`Get the valid UTM params based on real URL with some invalid params`, () => {
            window.location = {
                toString: () =>
                    "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_term=term&utm_invalid=invalid",
                origin: "http://example.com",
                pathname: "/"
            };

            expect(UTMPurser.parseUTM()).not.toHaveProperty("utm_invalid");
        });

        it(`Return empty object if URL does not contain utm params`, () => {
            window.location = {
                toString: () => "http://example.com",
                origin: "http://example.com",
                pathname: "/"
            };

            const notExpected = {
                utm_source: "example",
                utm_medium: "medium",
                utm_campaign: "campaign",
                utm_content: "content",
                utm_name: "name"
            };

            expect(UTMPurser.parseUTM()).toEqual(expect.not.objectContaining(notExpected));
        });
    });

    describe("UTMPurser.save()", () => {
        it(`Saves proper object to localStorage`, () => {
            const params = {
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

            expect(UTMPurser.save(params)).toBe(true);

            expect(localStorage.setItem).toHaveBeenLastCalledWith("purser_visitor", JSON.stringify(params));
            expect(Object.keys(localStorage.__STORE__).length).toBe(1);
            expect(localStorage.__STORE__.purser_visitor).toStrictEqual(JSON.stringify(params));
        });
    });

    describe("UTMPurser.update()", () => {});

    describe("UTMPurser.get()", () => {
        it(`Retrieves the proper object from localStorage`, () => {
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

            const UTMPurserGet = jest.fn(() => UTMPurser.get());
            UTMPurserGet();
            expect(localStorage.getItem).toHaveBeenCalledWith("purser_visitor");
            expect(UTMPurserGet).toHaveReturnedWith(expected);
        });

        it(`Return false whem no object from localStorage is present`, () => {
            localStorage.clear();

            const UTMPurserGet = jest.fn(() => UTMPurser.get());
            UTMPurserGet();
            expect(localStorage.getItem).toHaveBeenCalledWith("purser_visitor");
            expect(UTMPurserGet).toHaveReturnedWith(false);
        });
    });
});
