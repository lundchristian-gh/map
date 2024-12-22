export const MapStyle = {
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

export const SkyStyle = {
    Night: {
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11, 11, 25)",
        "star-intensity": 0.6,
    },
    Day: {
        color: "rgb(135, 206, 235)",
        "high-color": "rgb(255, 255, 255)",
        "horizon-blend": 0.1,
        "space-color": "rgb(0, 191, 255)",
        "star-intensity": 0.0,
    },
};

export const DefaultConfig = {
    Sky: SkyStyle.Night,
    Map: {
        container: "map",
        zoom: 9,
        pitch: 80,
        bearing: 40,
        center: [18.7, 69.7],
        style: MapStyle.SatelliteStreets,
    },
    Source: {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
    },
    Terrain: {
        source: "mapbox-dem",
        exaggeration: 1.5,
    },
};

export const Endpoint = {
    Whale: "/whale",
    Other: "/other",
    Token: "/token",
    Worker: "/worker",
};
