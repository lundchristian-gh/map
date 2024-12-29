class Area {
    data: any; // GeoJSON
    name: string;
    endpoint: string;
    status: { summer: number; winter: number; both: number; none: number };

    constructor(name: string, endpoint: string) {
        this.name = name;
        this.endpoint = endpoint;
        this.status = { summer: 0, winter: 0, both: 0, none: 0 };
    }

    async load(): Promise<void> {
        const response: Response = await fetch(this.endpoint);
        this.data = await response.json();
        for (let index = 0; index < this.data.features.length; index++) {
            const visited: string =
                this.data.features[index].properties.visited;
            if (this.status[visited] !== undefined) {
                this.status[visited] += 1;
            }
        }
    }
}

class Region {
    name: string;
    areas: Area[];

    constructor(name: string, areas: Area[]) {
        this.name = name;
        this.areas = areas;
    }

    async load(): Promise<void> {
        for (let index = 0; index < this.areas.length; index++) {
            await this.areas[index].load();
        }
    }
}

class MapService {}

class Logic {
    map: MapService;
    region: Region;
    sky: {
        box: HTMLElement | null;
        day: {
            symbol: string;
            button: HTMLElement | null;
        };
        night: {
            symbol: string;
            button: HTMLElement | null;
        };
        render(): void;
    };
    visibility: {
        visible: boolean;
        button: HTMLElement | null;
        box: HTMLElement | null;
        isValid(): this is { button: HTMLElement; box: HTMLElement };
    };

    constructor(map: MapService, region: Region) {
        this.map = map;
        this.region = region;
        this.visibility = {
            visible: false,
            button: document.getElementById("gui-btn"),
            box: document.getElementById("gui-box"),
            isValid(): this is { button: HTMLElement; box: HTMLElement } {
                return this.button !== null && this.box !== null;
            },
        };
        this.sky = {
            box: document.getElementById("sky-box"),
            day: {
                symbol: "string",
                button: null,
            },
            night: {
                symbol: "string",
                button: null,
            },
            render(): void {
                this.sky.box.append;
            },
        };
        this.setUp();
    }

    setUp() {
        if (!this.visibility.isValid()) {
            console.log("ERROR");
            return;
        }
        this.visibility.visible = true;
        this.visibility.button.innerHTML = "Hide";
        this.visibility.button.addEventListener("click", () =>
            this.toggleVisibility()
        );
    }

    toggleVisibility() {
        if (!this.visibility.isValid()) {
            console.log("ERROR");
            return;
        }
        if (this.visibility.visible) {
            this.visibility.visible = false;
            this.visibility.box.hidden = true;
            this.visibility.button.innerHTML = "Show";
        } else {
            this.visibility.visible = true;
            this.visibility.box.hidden = false;
            this.visibility.button.innerHTML = "Hide";
        }
    }
}

async function main() {
    const map: MapService = new MapService();

    const areas: Area[] = [
        new Area("Kvaløya", "http://127.0.0.1:8080/kvaloya"),
        new Area("Malangen", "http://127.0.0.1:8080/malangen"),
        new Area("Ringvassøya", "http://127.0.0.1:8080/ringvassoya"),
    ];

    const troms: Region = new Region("Troms", areas);

    // const gui = new Logic(map, troms);

    try {
        await troms.load();
        // console.log(troms.areas[0]);
    } catch (error) {
        console.log(error);
    }
}

main();
// document.addEventListener("DOMContentLoaded", main);
