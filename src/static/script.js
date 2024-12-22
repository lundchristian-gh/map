import { Endpoint, NightConfig, DayConfig } from "./const.js";
import { getColorBasedOn, getMessageBasedOn, fetchData } from "./utils.js";

document.addEventListener("DOMContentLoaded", init);

let map = null;
let token = null;
let config = null;
let whaleGJ = null;
let otherGJ = null;
let markers = [];

function renderPopup(props) {
    return `
        <div class="popup-container">
            <h2>${props.name} (${props.masl} masl)</h2>
            <p>${getMessageBasedOn(props.visited)}</p>
        </div>
    `;
}

function addEventHandlers() {
    const whaleButton = document.getElementById("whale");
    const otherButton = document.getElementById("other");
    whaleButton.addEventListener("click", () => onChangeDataLayer(whaleGJ));
    otherButton.addEventListener("click", () => onChangeDataLayer(otherGJ));

    const dayButton = document.getElementById("day");
    const nightButton = document.getElementById("night");
    dayButton.addEventListener("click", () => onChangeTheme("day"));
    nightButton.addEventListener("click", () => onChangeTheme("night"));
}

function addServiceWorkers() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register(Endpoint.Worker)
            .then((registration) => {
                console.log(registration.scope);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

async function init() {
    config = NightConfig;
    token = await fetchData(Endpoint.Token);
    whaleGJ = await fetchData(Endpoint.Whale);
    otherGJ = await fetchData(Endpoint.Other);
    addEventHandlers();
    // addServiceWorkers();
    main();
}

async function onChangeDataLayer(geojson) {
    if (map && geojson) {
        markers.forEach((marker) => marker.remove());
        markers = [];

        geojson.features.forEach((feature) => {
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

function onChangeTheme(theme) {
    if (theme === "day") {
        config = DayConfig;
    } else if (theme === "night") {
        config = NightConfig;
    }
    if (map) {
        map.setFog(config.Sky);
    }
}

function main() {
    if (token && whaleGJ) {
        mapboxgl.accessToken = token.token;
        map = new mapboxgl.Map(config.Map);
        map.on("style.load", () => {
            map.setFog(config.Sky);
            map.addSource("mapbox-dem", config.Source);
            map.setTerrain(config.Terrain);
        });
        map.on("load", () => {
            whaleGJ.features.forEach((feature) => {
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
        document.getElementById("map").innerHTML =
            "<p>Please try again later</p>";
    }
}
