import { Endpoint, DefaultConfig, MapStyle, SkyStyle } from "./const.js";
import { getColorBasedOn, fetchData, errorPage } from "./utils.js";

document.addEventListener("DOMContentLoaded", run);

let map = null;
let token = null;
let markers = null;
let whaleData = null;
let tromsData = null;

// id = document id | value = handler
const buttonHandlers = {
    whale: () => onChangeData(whaleData),
    other: () => onChangeData(tromsData),
    day: () => onChangeTheme(SkyStyle.Day),
    night: () => onChangeTheme(SkyStyle.Night),
    streets: () => onChangeMap(MapStyle.Streets),
    satellite: () => onChangeMap(MapStyle.SatelliteStreets),
};

async function run() {
    token = await fetchData(Endpoint.Token);
    whaleData = await fetchData(Endpoint.Whale);
    tromsData = await fetchData(Endpoint.Other);
    markers = [];
    initializeMap(DefaultConfig);
    addHandlers(buttonHandlers);
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
            });
        });
    } else {
        document.body.innerHTML = errorPage();
    }
}

function renderPopup(props) {
    return `
        <div class="popup-container">
            <h2>${props.name} [${props.masl}]</h2>
        </div>
    `;
}

function addHandlers(handlers) {
    Object.entries(handlers).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener("click", handler);
    });
}

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
