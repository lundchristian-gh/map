const MapStyle = {
    Dark: "mapbox://styles/mapbox/dark-v11",
    Light: "mapbox://styles/mapbox/light-v11",
    Standard: "mapbox://styles/mapbox/standard",
    Streets: "mapbox://styles/mapbox/streets-v12",
    Outdoors: "mapbox://styles/mapbox/outdoors-v12",
    Satellite: "mapbox://styles/mapbox/satellite-v9",
    NavigationDay: "mapbox://styles/mapbox/navigation-day-v1",
    NavigationNight: "mapbox://styles/mapbox/navigation-night-v1",
    SatelliteStreets: "mapbox://styles/mapbox/satellite-streets-v12",
};

const Endpoint = {
    Token: "/token",
    Data: "/data",
};

const mapConfig = {
    container: "map",
    zoom: 9,
    center: [18.4685326, 69.7180472],
    pitch: 80,
    bearing: 41,
    style: MapStyle.Satellite,
};

const skyConfig = {
    color: "rgb(186, 210, 235)",
    "high-color": "rgb(36, 92, 223)",
    "horizon-blend": 0.02,
    "space-color": "rgb(11, 11, 25)",
    "star-intensity": 0.6,
};

function buildMap(token) {
    try {
        // https://docs.mapbox.com/mapbox-gl-js/api/map/
        const map = new mapboxgl.Map({
            accessToken: token,
            ...mapConfig,
        });
        // https://docs.mapbox.com/mapbox-gl-js/guides/globe/
        map.on("style.load", () => {
            map.setFog(skyConfig);
        });
        // https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/
        map.on("style.load", () => {
            map.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14,
            });
            map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
        });
        return map;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchMapboxToken() {
    try {
        const response = await fetch(Endpoint.Token);
        const data = await response.json();
        return data.MAPBOX_TOKEN;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchGeoJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getColorBasedOn(visited) {
    const winter = ["winter", "#80C4E9"];
    const summer = ["summer", "#FA812F"];
    const both = ["both", "#1A1A19"];
    const none = ["none", "#FEEC37"];
    let result = none[1];

    switch (visited) {
        case winter[0]:
            result = winter[1];
            break;
        case summer[0]:
            result = summer[1];
            break;
        case both[0]:
            result = both[1];
            break;
        default:
            break;
    }

    return result;
}

function getMessageBasedOn(visited) {
    const winter = ["winter", "Only visited in winter"];
    const summer = ["summer", "Only visited in summer"];
    const both = ["both", "Visited in both seasons"];
    const none = ["none", "Never visited"];
    let result = none[1];

    switch (visited) {
        case winter[0]:
            result = winter[1];
            break;
        case summer[0]:
            result = summer[1];
            break;
        case both[0]:
            result = both[1];
            break;
        default:
            break;
    }

    return result;
}

function generatePopupHTML(properties) {
    return `
        <div class="popup-container">
            <h3 class="popup-title">${properties.name}</h3>
            <p class="popup-elevation">Elevation: ${properties.masl} masl</p>
            <p class="popup-visited">${getMessageBasedOn(
                properties.visited
            )}</p>
        </div>
    `;
}

function applyGeoJSON(map, geojson) {
    map.on("load", () => {
        geojson.features.forEach((feature) => {
            const properties = feature.properties;
            const coordinates = feature.geometry.coordinates;
            const popup = new mapboxgl.Popup({
                maxWidth: "400px",
                className: "custom-popup",
            }).setHTML(generatePopupHTML(properties));

            const marker = new mapboxgl.Marker({
                color: getColorBasedOn(properties.visited),
            })
                .setLngLat(coordinates)
                .setPopup(popup)
                .addTo(map);
        });
    });
}

function renderInfoBox() {
    const infoBox = document.getElementById("info-box");
    infoBox.innerHTML = "";
    const heading = document.createElement("h2");
    const paragraph = document.createElement("p");
    heading.textContent = "Kvaløya";
    paragraph.textContent = "All peaks with a prominence of 100 meters";
    infoBox.appendChild(heading);
    infoBox.appendChild(paragraph);
    infoBox.appendChild(button);
}

async function init() {
    const mbToken = await fetchMapboxToken();
    if (mbToken) {
        const map = buildMap(mbToken);
        const geojson = await fetchGeoJSON(Endpoint.Data);

        if (map && geojson) {
            applyGeoJSON(map, geojson);
            renderInfoBox();
        } else {
            map_element = document.getElementById("map");
            map_element.innerHTML = "<p>Please try again later.</p>";
        }
    }
}

init();
