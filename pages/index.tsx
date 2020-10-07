import React from "react";
import { Box, Card, CardContent, Grid, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { NextPage } from "next";
import Head from "next/head";
import CSS from "csstype";

import locales from "../src/config/locales";
import Chart from "../src/components/GlobalChart";
import Axios from "axios";

import Navbar from "../src/components/Navbar";
import { Country, TimelineObject } from "../src/config";

const GlobalOverview: NextPage<{ data: TimelineObject[]; lang: string; countries: Country[] }> = ({ data, lang, countries }) => {
    const is1600 = useMediaQuery("only screen and (max-width: 1600px)");
    const isMobile = useMediaQuery("only screen and (max-width: 959px)");
    const CardStyle: CSS.Properties = {
        height: "200px",
        padding: "12px",
        position: "relative",
    };

    const today = data[63]!;
    const yesterday = data[62]!;
    const twoDaysAgo = data[61]!;
    const compared = yesterday.total_cases - twoDaysAgo.total_cases;

    return (
        <>
            <Head>
                <title>{locales.globalOverview}</title>
            </Head>
            <Navbar countries={countries} />
            <Grid container style={{ padding: "16px 12px" }}>
                {isMobile && (
                    <Grid item xs={12} style={{ marginBottom: 12 }}>
                        <Typography variant="h4">{locales.globalData}</Typography>
                    </Grid>
                )}
                <Grid item container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.confirmed}:
                            </Typography>
                            <Typography variant="h4" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.total_cases)}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.compared}:
                            </Typography>
                            <Typography variant="h4" style={{ color: compared < 0 ? "green" : compared === 0 ? "inherit" : "red", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {compared > 0 ? "+" : null}
                                {Intl.NumberFormat(lang).format(compared)}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.recovered}:
                            </Typography>

                            <Typography variant="h4" style={{ color: "green", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.total_recovered)}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.deaths}:
                            </Typography>

                            <Typography variant="h4" style={{ color: "red", margin: "auto", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.total_deaths)}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
                {!isMobile && (
                    <Grid item xs={12} style={{ marginTop: 24, padding: is1600 ? 0 : "0 12.5%" }}>
                        <Typography variant="h4">{locales.chartTitleGlobal}:</Typography>
                        <Chart data={data} />
                    </Grid>
                )}
            </Grid>
        </>
    );
};

GlobalOverview.getInitialProps = async (ctx) => {
    const data = await Axios.get("https://covid19-api.org/api/timeline");
    const countries = await Axios.get("https://covid19-api.org/api/countries");

    let finalData: TimelineObject[] = [];
    for (let i = 0; i < 64; i++) {
        finalData.push(data.data[i]);
    }

    return { data: finalData.sort((a, b) => new Date(a.last_update).getTime() - new Date(b.last_update).getTime()), lang: ctx.req.headers["accept-language"].split(",")[0], countries: countries.data };
};

export default GlobalOverview;
