import { Endpoint, DefaultConfig, MapStyle, SkyStyle } from "./config.js";
import {
    getColorBasedOn,
    fetchData,
    errorPage,
    logVisited,
    getInfo,
    getLegend,
    renderPopup,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", run);

let map = null; // object representing the map from MapBox
let token = null; // token for MapBox
let showUI = null; // boolean for showing the menu
let online = null; // boolean mostly for fast UI development
let markers = null; // list holding the markers
let whaleData = null; // GeoJSON for Kvaløya
let tromsData = null; // GeoJSON for Troms (excluding Kvaløya)
let infoToggle = null; // state for what info to display

let whaleState = {
    both: 0,
    none: 0,
    summer: 0,
    winter: 0,
};

const buttonHandlers = {
    // id = document id | value = handler
    screen: () => onHide(showUI),
    info: () => onChangeInfo(infoToggle),
    whale: () => onChangeData(whaleData),
    other: () => onChangeData(tromsData),
    day: () => onChangeTheme(SkyStyle.Day),
    night: () => onChangeTheme(SkyStyle.Night),
    streets: () => onChangeMap(MapStyle.Streets),
    satellite: () => onChangeMap(MapStyle.SatelliteStreets),
};

async function run() {
    markers = [];
    showUI = true;
    online = true;
    infoToggle = "info";
    addClickHandlers(buttonHandlers);
    if (online) {
        token = await fetchData(Endpoint.Token);
        whaleData = await fetchData(Endpoint.Whale);
        tromsData = await fetchData(Endpoint.Other);
        initializeMap(DefaultConfig);
    }
}

function initializeMap(config) {
    if (token && whaleData) {
        mapboxgl.accessToken = token.token;
        map = new mapboxgl.Map(config.Map);
        map.on("style.load", () => {
            map.setFog(config.Sky);
            map.addSource("mapbox-dem", config.Source);
            map.setTerrain(config.Terrain);
        });
        map.on("load", () => {
            whaleData.features.forEach((feature) => {
                const properties = feature.properties;
                const coordinates = feature.geometry.coordinates;
                const popup = new mapboxgl.Popup({ maxWidth: "400px" }).setHTML(
                    renderPopup(properties)
                );
                const marker = new mapboxgl.Marker({
                    color: getColorBasedOn(properties.visited),
                })
                    .setLngLat(coordinates)
                    .setPopup(popup)
                    .addTo(map);
                markers.push(marker);
                logVisited(properties.visited, whaleState);
            });
        });
    } else {
        document.body.innerHTML = errorPage();
    }
}

function addClickHandlers(handlers) {
    Object.entries(handlers).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener("click", handler);
    });
}

/********** CLICK HANDLERS **********/

function onChangeData(data) {
    if (map && data) {
        markers.forEach((marker) => marker.remove());
        markers = [];

        data.features.forEach((feature) => {
            const properties = feature.properties;
            const coordinates = feature.geometry.coordinates;
            const popup = new mapboxgl.Popup({ maxWidth: "400px" }).setHTML(
                renderPopup(properties)
            );
            const marker = new mapboxgl.Marker({
                color: getColorBasedOn(properties.visited),
            })
                .setLngLat(coordinates)
                .setPopup(popup)
                .addTo(map);
            markers.push(marker);
        });
    }
}

function onChangeMap(style) {
    if (map) {
        map.setStyle(style);
    }
}

function onChangeTheme(theme) {
    if (map) {
        map.setFog(theme);
    }
}

function onHide(show) {
    if (show) {
        showUI = false;
        document.getElementById("ui").hidden = true;
        document.getElementById("screen").innerHTML = "Show";
    } else {
        showUI = true;
        document.getElementById("ui").hidden = false;
        document.getElementById("screen").innerHTML = "Hide";
    }
}

function onChangeInfo(val) {
    const box = document.getElementById("legend-box");
    box.innerHTML = "";
    if (val === "legend") {
        infoToggle = "info";
        box.innerHTML = getLegend();
    } else if (val === "info") {
        infoToggle = "legend";
        box.innerHTML = getInfo(whaleState);
    }
}
