import UTMPurser from "./index";

class Pageviews {
    static add() {
        let attributes = UTMPurser.get();
        attributes.pageviews = attributes.pageviews + 1 || 1;
        return UTMPurser.update(attributes);
    }
}

export default Pageviews;
