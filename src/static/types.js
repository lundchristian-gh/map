export const area = () => ({
    // name of the area
    _name: null,
    get name() {
        return this._name;
    },
    set name(name) {
        this._name = name;
    },

    // visitation status data
    _status: { both: 0, none: 0, summer: 0, winter: 0 },
    get status() {
        return this._status;
    },
    set status(status) {
        this._status = status;
    },

    // geojson data
    _geojson: null,
    get geojson() {
        return this._geojson;
    },
    set geojson(geojson) {
        this._geojson = geojson;
    },
});
