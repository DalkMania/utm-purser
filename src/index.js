import "url-polyfill";
import Storage from "./Storage";
import Pageviews from "./PageViews";
import Visits from "./Visits";

const allowedUTMParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_name", "utm_term", "gclid"];
const storage = new Storage();

class UTMPurser {
    /**
     * Initialize the Purser
     *
     */
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

    /**
     * Create the Purser Local Storage Object
     *
     * @return {Object}
     */
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

    /**
     * Update the Purser Local Storage Object
     *
     * @return {Object}
     */
    static update(obj) {
        let attributes = this.get();
        if (!attributes) {
            attributes = this.create();
        }
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                attributes[key] = obj[key];
            }
        }

        this.save(attributes);
        return attributes;
    }
    /**
     * Convert the Local Storage Object and
     * add relevant conversion details
     *
     * @return {Object}
     */
    static convert(obj) {
        let attributes = this.update(obj);
        attributes.converted_at = new Date().toISOString();
        attributes.conversion_page = window.location.origin + window.location.pathname;
        attributes.visits_at_conversion = (attributes.visits || []).length;
        attributes.pageviews_before_conversion = attributes.pageviews || 0;
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
        allowedUTMParams.forEach((key) => {
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
