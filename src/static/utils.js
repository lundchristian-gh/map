// utils.js

function getBasedOn(visited, mappings) {
    const defaultMapping = mappings.find(([key]) => key === "none");
    const mapping = mappings.find(([key]) => key === visited) || defaultMapping;
    return mapping[1];
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