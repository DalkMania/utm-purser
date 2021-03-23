import "url-polyfill";
import UTMStorage from "./UTMStorage";
import Pageviews from "./PageViews";
import Visits from "./Visits";

const allowedUTMParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_name", "utm_term", "gclid"];
const storage = new UTMStorage();

class UTMPurser {
    static init() {
        if (!this.get()) {
            this.create();
        } else {
            if (!Visits.recently()) {
                Visits.create();
            }
            Pageviews.add();
        }
    }

    static create() {
        const attributes = {
            referrer: document.referrer.length ? document.referrer : "direct",
            browser_timezone: new Date().getTimezoneOffset() / 60,
            browser_language: window.navigator.language,
            landing_page: window.location.origin + window.location.pathname,
            last_visit: parseInt(new Date().getTime() / 1000),
            pageviews: 1,
            first_website_visit: new Date().toISOString(),
            screen_height: window.screen.height,
            screen_width: window.screen.width,
            ...this.parseUTM()
        };

        this.save(attributes);

        return attributes;
    }

    static update(obj) {
        let attributes = this.get();
        if (!attributes) {
            attributes = this.create();
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                attributes[key] = obj[key];
            }
        }

        this.save(attributes);
        return attributes;
    }

    /**
     * Get utm params allowed by GA
     *
     * @return {Object}
     */
    static parseUTM() {
        const urlSearch = new URL(window.location);
        const urlParams = new URLSearchParams(urlSearch.search);
        const parsedParams = {};
        allowedUTMParams.map((key) => {
            const paramValue = urlParams.get(key);
            if (paramValue) {
                parsedParams[key] = paramValue;
            }
        });
        return parsedParams;
    }

    /**
     * Save params in localStorage
     *
     * @param {Object} params
     * @return {Boolean}
     */
    static save(params) {
        if (!params) {
            return false;
        }

        storage.setItem("purser_visitor", JSON.stringify(params));
        return true;
    }

    /**
     * Reads Object from localStorage
     *
     * @return {Object}
     */
    static get() {
        const savedParams = storage.getItem("purser_visitor");
        if (savedParams) {
            return JSON.parse(savedParams);
        }
        return false;
    }

    /**
     * Removes Object from localStorage
     *
     * @return {Boolean}
     */
    static remove() {
        return storage.removeItem("purser_visitor");
    }
}

export default UTMPurser;
