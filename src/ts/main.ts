export class Peak {
    name: string;
    masl: number;
    visited: string;
    coordinates: [number, number];
    constructor(
        name: string,
        masl: number,
        visited: string,
        coordinates: [number, number]
    ) {
        this.name = name;
        this.masl = masl;
        this.visited = visited;
        this.coordinates = coordinates;
    }
}

export class VisitationStats {
    both: number;
    none: number;
    winter: number;
    summer: number;

    constructor() {
        this.both = 0;
        this.none = 0;
        this.winter = 0;
        this.summer = 0;
    }

    update(visited: string): void {
        switch (visited) {
            case "both":
                this.both += 1;
                break;
            case "none":
                this.none += 1;
                break;
            case "summer":
                this.summer += 1;
                break;
            case "winter":
                this.winter += 1;
                break;
            default:
                break;
        }
    }
}

export class Area {
    data: any; // GeoJSON
    name: string;
    peaks: Peak[];
    visitation: VisitationStats;
    constructor(name: string, data: any) {
        this.name = name;
        this.peaks = [];
        this.data = data;
        this.visitation = new VisitationStats();
    }

    load() {
        const features = this.data.features;
        for (let index = 0; index < features.length; index++) {
            const feature = features[index];
            const peak = new Peak(
                feature.properties.name,
                feature.properties.masl,
                feature.properties.visited,
                feature.geometry.coordinates
            );
            this.visitation.update(feature.properties.visited);
            this.peaks.push(peak);
        }
    }
}

export class Region {
    name: string;
    areas: Area[];
    constructor(name: string, areas: Area[]) {
        this.name = name;
        this.areas = areas;
    }
    load() {
        for (let index = 0; index < this.areas.length; index++) {
            this.areas[index].load();
        }
    }
}

/********************************************************************/

// import mapboxgl from "mapbox-gl";

async function main(): Promise<void> {
    const endpoints: string[] = [
        "http://127.0.0.1:8080/config",
        "http://127.0.0.1:8080/kvaloya",
        "http://127.0.0.1:8080/malangen",
        "http://127.0.0.1:8080/fastlandet",
        "http://127.0.0.1:8080/ringvassoya",
    ];

    const jsonData: any[] = [];
    for (let index: number = 0; index < endpoints.length; index++) {
        const response = await fetch(endpoints[index]);
        const data = await response.json();
        if (!data) {
            console.log("Error fetching " + endpoints[index]);
            return;
        }
        jsonData.push(data);
    }

    const token: string = jsonData[0].token;

    const areas: Area[] = [
        new Area("Kvaløya", jsonData[1]),
        new Area("Malangen", jsonData[2]),
        new Area("Fastlandet", jsonData[3]),
        new Area("Ringvassøya", jsonData[4]),
    ];

    const region: Region = new Region("Troms", areas);
    region.load();
}

main();
