// script.js

import { Area, State } from "./types.js";
import { Endpoint, DefaultConfig, MapStyle, SkyStyle } from "./config.js";

document.addEventListener("DOMContentLoaded", run);

let _state = State();

let _areas = [
    Area("Kvaløya", "🐳", "area1", "/kvaloya"),
    Area("Malangen", "🪿", "area3", "/malangen"),
    Area("Fastlandet", "🐻", "area4", "/fastlandet"),
    Area("Ringvassøya", "🛟", "area2", "/ringvassoya"),
];

async function loadAreas(areas) {
    for (let index = 0; index < areas.length; index++) {
        const area = areas[index];
        try {
            const response = await fetch(area.endpoint);
            area.geojson = await response.json();
            area.updateStatus();
        } catch (error) {
            throw error;
        }
    }
}

function renderAreas(areas) {
    const areaBox = document.getElementById("area-box");
    for (let index = 0; index < areas.length; index++) {
        const area = areas[index];
        const button = document.createElement("button");
        button.id = area.id;
        button.className = "btn";
        button.innerHTML = area.symbol;
        button.addEventListener("click", () => onChangeMarkerData(area));
        areaBox.appendChild(button);
    }
}

// id = document id | value = handler
const buttonHandlers = {
    // sky box
    day: () => onChangeMapSky(SkyStyle.Day),
    night: () => onChangeMapSky(SkyStyle.Night),
    // map box
    streets: () => onChangeMapStyle(MapStyle.Streets),
    satellite: () => onChangeMapStyle(MapStyle.SatelliteStreets),
    // buttons
    screen: () => onToggleUI(_state.toggleUI),
};

function addClickHandlers(handlers) {
    Object.entries(handlers).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener("click", handler);
    });
}

async function loadToken(state) {
    try {
        const response = await fetch(Endpoint.Token);
        const token = await response.json();
        state.token = token.token;
    } catch (error) {
        throw error;
    }
}

async function run() {
    await loadToken(_state);
    await loadAreas(_areas);
    renderAreas(_areas);
    onToggleUI(false);
    addClickHandlers(buttonHandlers);

    // init map
    if (_state.token) {
        mapboxgl.accessToken = _state.token;
        _state.map = new mapboxgl.Map(DefaultConfig.Map);
        _state.map.on("style.load", () => {
            _state.map.setFog(DefaultConfig.Sky);
            _state.map.addSource("mapbox-dem", DefaultConfig.Source);
            _state.map.setTerrain(DefaultConfig.Terrain);
        });
        _state.map.on("load", () => {
            onChangeMarkerData(_areas[0]);
        });
    } else {
        document.body.innerHTML = "<p>TBD</p>";
    }
}

function getMarkerColor(visited) {
    const mappings = [
        ["winter", "#80C4E9"],
        ["summer", "#FA812F"],
        ["both", "#1A1A19"],
        ["none", "#FEEC37"],
    ];
    const defaultMapping = mappings.find(([key]) => key === "none");
    const mapping = mappings.find(([key]) => key === visited) || defaultMapping;
    return mapping[1];
}

/********** CLICK HANDLERS **********/

function onChangeMarkerData(area) {
    _state.markers.forEach((marker) => marker.remove());
    _state.markers = [];
    area.geojson.features.forEach((feature) => {
        const popup = new mapboxgl.Popup({ maxWidth: "400px" }).setHTML(`
            <div class="popup-container">
                <h2>${feature.properties.name} [${feature.properties.masl}]</h2>
            </div>
        `);
        const marker = new mapboxgl.Marker({
            color: getMarkerColor(feature.properties.visited),
        })
            .setLngLat(feature.geometry.coordinates)
            .setPopup(popup)
            .addTo(_state.map);
        _state.markers.push(marker);
    });
    setInfoBox(area);
}

function onChangeMapStyle(style) {
    _state.map.setStyle(style);
}

function onChangeMapSky(theme) {
    _state.map.setFog(theme);
}

function onToggleUI(on) {
    if (on) {
        _state.toggleUI = false;
        document.getElementById("ui").hidden = true;
        document.getElementById("screen").innerHTML = "Show";
    } else {
        _state.toggleUI = true;
        document.getElementById("ui").hidden = false;
        document.getElementById("screen").innerHTML = "Hide";
    }
}

function setInfoBox(area) {
    const name = area.name;
    const both = area.status.both;
    const none = area.status.none;
    const winter = area.status.winter;
    const summer = area.status.summer;

    const total = both + none + winter + summer;
    const totalVisited = both + winter + summer;
    const coverage = ((totalVisited / total) * 100).toFixed(2);
    const html = `
        <h2>${name}</h2>
        <p>Visited: ${totalVisited}</p>
        <p>Missing: ${none}</p>
        <p>Coverage: ${coverage}%</p>
    `;

    document.getElementById("info-box").innerHTML = html;
}

function getLegend() {
    return `
        <h2>Visited</h2>
        <p>⚫ Both</p>
        <p>🟡 Never</p>
        <p>🔵 Winter</p>
        <p>🟠 Summer</p>
    `;
}
