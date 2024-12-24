function getBasedOn(visited, mappings) {
    const defaultMapping = mappings.find(([key]) => key === "none");
    const mapping = mappings.find(([key]) => key === visited) || defaultMapping;
    return mapping[1];
}

export function renderPopup(props) {
    return `
        <div class="popup-container">
            <h2>${props.name} [${props.masl}]</h2>
        </div>
    `;
}

export function getColorBasedOn(visited) {
    const colorMappings = [
        ["winter", "#80C4E9"],
        ["summer", "#FA812F"],
        ["both", "#1A1A19"],
        ["none", "#FEEC37"],
    ];
    return getBasedOn(visited, colorMappings);
}

export function getMessageBasedOn(visited) {
    const messageMappings = [
        ["winter", "Only visited in winter"],
        ["summer", "Only visited in summer"],
        ["both", "Visited in both seasons"],
        ["none", "Never visited"],
    ];
    return getBasedOn(visited, messageMappings);
}

export async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function errorPage() {
    return `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; background-color: #f8d7da; color: #721c24;">
            <div>
                <h1>Error</h1>
                <p>Something went wrong. Please try again later.</p>
            </div>
        </div>
    `;
}

export function logVisited(status, state) {
    switch (status) {
        case "summer":
            state.summer += 1;
            break;
        case "winter":
            state.winter += 1;
            break;
        case "both":
            state.both += 1;
            break;
        case "none":
            state.none += 1;
            break;
        default:
            break;
    }
}

export function getLegend() {
    return `
        <h2>Visited</h2>
        <p>⚫ Both</p>
        <p>🟡 Never</p>
        <p>🔵 Winter</p>
        <p>🟠 Summer</p>
        `;
}

export function getInfo(state) {
    const both = state.both;
    const none = state.none;
    const winter = state.winter;
    const summer = state.summer;
    const total = both + none + winter + summer;
    const totalVisited = both + winter + summer;
    const coverage = ((totalVisited / total) * 100).toFixed(2);
    return `
        <h2>Kvaløya</h2>
        <p>Visited: ${totalVisited}</p>
        <p>Missing: ${none}</p>
        <p>Coverage: ${coverage}%</p>
    `;
}
