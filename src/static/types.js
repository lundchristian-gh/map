// types.js

export const State = () => ({
    map: null, // MapBox map object
    token: null, // MapBox token string
    markers: [], // list of markers
    toggleUI: null, // boolean UI toggler
    toggleInfoBox: null, // boolean info toggler
});

export const Area = (name, symbol, id, endpoint) => ({
    _name: name,
    _symbol: symbol,
    _id: id,
    _endpoint: endpoint,

    // name of the area
    get name() {
        return this._name;
    },

    // symbol of the area
    get symbol() {
        return this._symbol;
    },

    // id of the area
    get id() {
        return this._id;
    },

    // endpoint of the area
    get endpoint() {
        return this._endpoint;
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

    // methods
    updateStatus() {
        this.geojson.features.forEach((feature) => {
            switch (feature.properties.visited) {
                case "summer":
                    this.status.summer += 1;
                    break;
                case "winter":
                    this.status.winter += 1;
                    break;
                case "both":
                    this.status.both += 1;
                    break;
                case "none":
                    this.status.none += 1;
                    break;
                default:
                    break;
            }
        });
    },
});
