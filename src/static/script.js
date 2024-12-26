import { Endpoint, DefaultConfig, MapStyle, SkyStyle } from "./config.js";
import {
    getColorBasedOn,
    fetchData,
    renderPopup,
    logVisited,
    getInfo,
} from "./utils.js";
import { area } from "./types.js";

document.addEventListener("DOMContentLoaded", run);

const defaultData = () => ({
    meta: null, // visitation status data
    json: null, // geojson data
});

const defaultState = () => ({
    info: null,
    map: null, // MapBox map object
    token: null, // MapBox token string
    markers: [], // list of markers
    toggleUI: null, // boolean UI toggler
    toggleInfoBox: null, // boolean info toggler
});

let data = {
    zone1: defaultData(), // GeoJSON for Kvaløya
    zone2: defaultData(), // GeoJSON for Ringvassøya
    zone3: defaultData(), // GeoJSON for Malangen
    zone4: defaultData(), // GeoJSON for Fastlandet
    zone5: defaultData(), // GeoJSON for Lyngen
};

let state = defaultState();

// id = document id | value = handler
const buttonHandlers = {
    // layer box
    kvaloya: () => onChangeMarkerData(data.zone1),
    ringvassoya: () => onChangeMarkerData(data.zone2),
    malangen: () => onChangeMarkerData(data.zone3),
    fastlandet: () => onChangeMarkerData(data.zone4),
    // sky box
    day: () => onChangeMapSky(SkyStyle.Day),
    night: () => onChangeMapSky(SkyStyle.Night),
    // map box
    streets: () => onChangeMapStyle(MapStyle.Streets),
    satellite: () => onChangeMapStyle(MapStyle.SatelliteStreets),
    // buttons
    screen: () => onToggleUI(state.toggleUI),
    info: () => onToggleInfoBox(state.toggleInfoBox),
};

function addClickHandlers(handlers) {
    Object.entries(handlers).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener("click", handler);
    });
}

async function run() {
    // load data
    state.token = await fetchData(Endpoint.Token);
    data.zone1.json = await fetchData(Endpoint.Kvaloya);
    data.zone2.json = await fetchData(Endpoint.Ringvassoya);
    data.zone3.json = await fetchData(Endpoint.Malangen);
    data.zone4.json = await fetchData(Endpoint.Fastlandet);
    // process data
    data.zone1.meta = logVisited(data.zone1.json);
    data.zone2.meta = logVisited(data.zone2.json);
    data.zone3.meta = logVisited(data.zone3.json);
    data.zone4.meta = logVisited(data.zone4.json);
    // assign data
    data.zone1.name = "Kvaløya";
    data.zone2.name = "Ringvassøya";
    data.zone3.name = "Malangen";
    data.zone4.name = "Fastlandet";
    // init ui
    onToggleUI(false);
    onToggleInfoBox(true);
    addClickHandlers(buttonHandlers);
    // init map
    if (state.token) {
        mapboxgl.accessToken = state.token.token;
        state.map = new mapboxgl.Map(DefaultConfig.Map);
        state.map.on("style.load", () => {
            state.map.setFog(DefaultConfig.Sky);
            state.map.addSource("mapbox-dem", DefaultConfig.Source);
            state.map.setTerrain(DefaultConfig.Terrain);
        });
        state.map.on("load", () => {
            onChangeMarkerData(data.zone1);
        });
    } else {
        document.body.innerHTML = "<p>TBD</p>";
    }
}

/********** CLICK HANDLERS **********/

function onChangeMarkerData(input) {
    const geojson = input.json;
    state.meta = input.meta;
    state.name = input.name;
    state.markers.forEach((marker) => marker.remove());
    state.markers = [];
    geojson.features.forEach((feature) => {
        const popup = new mapboxgl.Popup({ maxWidth: "400px" }).setHTML(
            renderPopup(feature.properties)
        );
        const marker = new mapboxgl.Marker({
            color: getColorBasedOn(feature.properties.visited),
        })
            .setLngLat(feature.geometry.coordinates)
            .setPopup(popup)
            .addTo(state.map);
        state.markers.push(marker);
    });
}

function onChangeMapStyle(style) {
    state.map.setStyle(style);
}

function onChangeMapSky(theme) {
    state.map.setFog(theme);
}

function onToggleUI(on) {
    if (on) {
        state.toggleUI = false;
        document.getElementById("ui").hidden = true;
        document.getElementById("screen").innerHTML = "Show";
    } else {
        state.toggleUI = true;
        document.getElementById("ui").hidden = false;
        document.getElementById("screen").innerHTML = "Hide";
    }
}

function onToggleInfoBox(on) {
    const box = document.getElementById("legend-box");
    box.innerHTML = "";

    if (on) {
        state.toggleInfoBox = false;
        box.innerHTML = `
            <h2>Visited</h2>
            <p>⚫ Both</p>
            <p>🟡 Never</p>
            <p>🔵 Winter</p>
            <p>🟠 Summer</p>
        `;
    } else {
        state.toggleInfoBox = true;
        box.innerHTML = getInfo(state.meta, state.name);
    }
}
