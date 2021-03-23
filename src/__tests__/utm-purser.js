import UTMPurser from "../index";

jest.useFakeTimers("modern").setSystemTime(new Date("2019-10-30").getTime());

describe("UTMPurser", () => {
    beforeEach(() => {
        delete window.location;
    });

    it(`Get proper UTM params based on real URL`, () => {
        window.location = {
            toString: () =>
                "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_tem=term",
            origin: "http://example.com",
            pathname: "/"
        };

        const expected = {
            utm_source: "example",
            utm_medium: "medium",
            utm_campaign: "campaign",
            utm_content: "content",
            utm_name: "name"
        };

        expect(UTMPurser.parseUTM()).toEqual(expect.objectContaining(expected));
    });

    it(`Get the valid UTM params based on real URL with some invalid params`, () => {
        window.location = {
            toString: () =>
                "http://example.com?utm_source=example&utm_content=content&utm_medium=medium&utm_campaign=campaign&utm_name=name&utm_tem=term&utm_invalid=invalid",
            origin: "http://example.com",
            pathname: "/"
        };

        expect(UTMPurser.parseUTM()).not.toHaveProperty("utm_invalid");
        console.log(UTMPurser.init());
    });
});
