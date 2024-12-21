import { Endpoint, NightConfig, DayConfig } from "./const.js";
import { getColorBasedOn, getMessageBasedOn, fetchData } from "./utils.js";

document.addEventListener("DOMContentLoaded", init);

let map = null;
let token = null;
let config = null;
let geojson = null;

function renderPopup(props) {
    return `
        <div class="popup-container">
            <h2>${props.name} (${props.masl} masl)</h2>
            <p>${getMessageBasedOn(props.visited)}</p>
        </div>
    `;
}

function addEventHandlers() {
    const dayButton = document.querySelector("[data-theme='day']");
    const nightButton = document.querySelector("[data-theme='night']");
    dayButton.addEventListener("click", () => onChangeTheme("day"));
    nightButton.addEventListener("click", () => onChangeTheme("night"));
}

async function init() {
    config = NightConfig;
    token = await fetchData(Endpoint.Token);
    geojson = await fetchData(Endpoint.Data);
    addEventHandlers();
    main();
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
    if (token && geojson) {
        mapboxgl.accessToken = token.token;
        map = new mapboxgl.Map(config.Map);
        map.on("style.load", () => {
            map.setFog(config.Sky);
            map.addSource("mapbox-dem", config.Source);
            map.setTerrain(config.Terrain);
        });
        map.on("load", () => {
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
            });
        });
    } else {
        document.getElementById("map").innerHTML =
            "<p>Please try again later</p>";
    }
}
