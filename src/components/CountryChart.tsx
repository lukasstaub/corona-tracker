import React from "react";
import { Line } from "react-chartjs-2";
import { CountryTimelineObject } from "../config";
import locales from "../config/locales";

const Chart: React.FC<{ data: CountryTimelineObject[] }> = ({ data }) => {
    return (
        <Line
            legend={{
                color: "white",
            }}
            data={{
                labels: data.map(({ last_update }) => new Date(last_update).toLocaleDateString()),
                datasets: [
                    {
                        data: data.map((data) => data.cases),
                        label: locales.infected,
                        borderColor: "#3333ff",
                        fill: true,
                    },
                    {
                        data: data.map((data) => data.deaths),
                        label: locales.deaths,
                        borderColor: "red",
                        backgroundColor: "rgba(255, 0, 0, 0.5)",
                        fill: true,
                    },
                ],
            }}
        />
    );
};

export default Chart;
