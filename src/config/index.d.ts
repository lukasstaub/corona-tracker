export interface TimelineObject {
    last_update: Date;
    total_cases: number;
    total_deaths: number;
    total_recovered: number;
}

export interface CountryTimelineObject {
    country: string;
    last_update: Date;
    cases: number;
    deaths: number;
    recovered: number;
}

export interface Country {
    name: string;
    alpha2: string;
    alpha3: string;
    numeric: string;
    latitude: number;
    longitude: number;
}
