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

const mapConfig = {
    container: "map",
    zoom: 9,
    center: [18.4685326, 69.7180472],
    pitch: 80,
    bearing: 41,
    style: MapStyle.Satellite,
};

const nightSkyConfig = {
    color: "rgb(186, 210, 235)",
    "high-color": "rgb(36, 92, 223)",
    "horizon-blend": 0.02,
    "space-color": "rgb(11, 11, 25)",
    "star-intensity": 0.6,
};

const daySkyConfig = {
    color: "rgb(135, 206, 235)", // Lighter color for day sky
    "high-color": "rgb(255, 255, 255)", // Brighter high color for daytime
    "horizon-blend": 0.1, // Increased horizon blend for day
    "space-color": "rgb(0, 191, 255)", // Light blue for day space color
    "star-intensity": 0.1, // Lower star intensity for day
};

const sourceConfig = {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
};

const terrainConfig = {
    source: "mapbox-dem",
    exaggeration: 1.5,
};

export const NightConfig = {
    Sky: nightSkyConfig,
    Map: mapConfig,
    Source: sourceConfig,
    Terrain: terrainConfig,
};

export const DayConfig = {
    Sky: daySkyConfig,
    Map: mapConfig,
    Source: sourceConfig,
    Terrain: terrainConfig,
};

export const Endpoint = {
    Token: "/token",
    Data: "/data",
};
