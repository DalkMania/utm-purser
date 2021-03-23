import UTMPurser from "./index";

class Visits {
    static recently() {
        const attributes = UTMPurser.get();
        if (!attributes.last_visit) return false;
        const timeDiffInHours = (parseInt(new Date().getTime() / 1000) - attributes.last_visit) / 3600;
        return timeDiffInHours < 0.5; // last visited less than half an hour ago.
    }

    static create() {
        let attributes = UTMPurser.get();
        attributes.visits = attributes.visits || [];
        let visit = UTMPurser.create();
        visit.id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        visit.date = new Date().toISOString();
        attributes.visits.push(visit);
        attributes.last_visit = parseInt(new Date().getTime() / 1000);
        UTMPurser.update(attributes);
        return attributes;
    }

    static get(id) {
        const attributes = UTMPurser.get();
        const visit = attributes.visits.filter((visit) => {
            return visit.id === id;
        })[0];

        visit.index = attributes.visits
            .map((visit) => {
                return visit.id;
            })
            .indexOf(id);
        return visit;
    }

    static update(id, obj) {
        let visit = this.get(id);
        let attributes = UTMPurser.get();

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                visit[key] = obj[key];
            }
        }

        attributes.visits[visit.index] = visit;
        return UTMPurser.update(attributes);
    }

    static delete(id) {
        let attributes = UTMPurser.get();
        const visit = this.get(id);
        attributes.visits = attributes.visits.splice(visit.index, 1);
        return UTMPurser.update(attributes);
    }

    static all() {
        const attributes = UTMPurser.get();
        return attributes.visits || [];
    }
}

export default Visits;
