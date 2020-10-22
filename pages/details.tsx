import React from "react";
import { Box, Card, CardContent, Grid, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { NextPage } from "next";
import Head from "next/head";
import CSS from "csstype";

import locales from "../src/config/locales";
import Chart from "../src/components/CountryChart";
import Axios from "axios";

import Navbar from "../src/components/Navbar";
import { Country, TimelineObject, CountryTimelineObject } from "../src/config";

const GlobalOverview: NextPage<{ data: CountryTimelineObject[]; lang: string; countries: Country[] }> = ({ data, lang, countries }) => {
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
    const balanceYesterday = yesterday.cases - twoDaysAgo.cases;
    const comparedYesterday = today.cases - yesterday.cases;

    const countryName = countries.find((el) => el.alpha2.toLowerCase() === data[0].country.toLowerCase()).name;

    return (
        <>
            <Head>
                <title>{locales.formatString(locales.countryOverview, countryName)}</title>
            </Head>
            <Navbar countries={countries} />
            <Grid container style={{ padding: "16px 12px" }}>
                {isMobile && (
                    <Grid item xs={12} style={{ marginBottom: 12 }}>
                        <Typography variant="h4">{locales.formatString(locales.dataFor, countryName)}</Typography>
                    </Grid>
                )}
                <Grid item container spacing={2}>
                    <Grid item xs={12} md={2}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.compared}:
                            </Typography>

                            <Typography variant="h4" style={{ color: balanceYesterday < 0 ? "green" : balanceYesterday === 0 ? "inherit" : "red", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {balanceYesterday > 0 ? "+" : null}
                                {Intl.NumberFormat(lang).format(balanceYesterday)}
                            </Typography>

                            <Typography color="textSecondary" style={{ position: "absolute", left: 8, bottom: 4 }}>
                                {locales.formatString(locales.lastUpdate, new Date(yesterday.last_update).toLocaleString())}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.comparedToYesterday}:
                            </Typography>

                            <Typography variant="h4" style={{ color: comparedYesterday < 0 ? "green" : comparedYesterday === 0 ? "inherit" : "red", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {comparedYesterday > 0 ? "+" : null}
                                {Intl.NumberFormat(lang).format(comparedYesterday)}
                            </Typography>

                            <Typography color="textSecondary" style={{ position: "absolute", left: 8, bottom: 4 }}>
                                {locales.formatString(locales.lastUpdate, new Date(today.last_update).toLocaleString())}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.confirmed}:
                            </Typography>

                            <Typography variant="h4" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.cases)}
                            </Typography>

                            <Typography color="textSecondary" style={{ position: "absolute", left: 8, bottom: 4 }}>
                                {locales.formatString(locales.lastUpdate, new Date(today.last_update).toLocaleString())}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.recovered}:
                            </Typography>

                            <Typography variant="h4" style={{ color: "green", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.recovered)}
                            </Typography>

                            <Typography color="textSecondary" style={{ position: "absolute", left: 8, bottom: 4 }}>
                                {locales.formatString(locales.lastUpdate, new Date(today.last_update).toLocaleString())}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Card style={CardStyle}>
                            <Typography variant="h6" style={{ position: "absolute" }}>
                                {locales.deaths}:
                            </Typography>

                            <Typography variant="h4" style={{ color: "red", margin: "auto", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                {Intl.NumberFormat(lang).format(today.deaths)}
                            </Typography>

                            <Typography color="textSecondary" style={{ position: "absolute", left: 8, bottom: 4 }}>
                                {locales.formatString(locales.lastUpdate, new Date(today.last_update).toLocaleString())}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
                {!isMobile && (
                    <Grid item xs={12} style={{ marginTop: 24, padding: is1600 ? 0 : "0 12.5%" }}>
                        <Typography variant="h4">{locales.formatString(locales.chartTitleCountry, countryName)}:</Typography>
                        <Chart data={data} />
                    </Grid>
                )}
            </Grid>
        </>
    );
};

GlobalOverview.getInitialProps = async (ctx) => {
    if (!ctx.query.country) {
        ctx.res.writeHead(302, {
            Location: "/",
        });
        ctx.res.end();
        return;
    }

    const data = await Axios.get(`https://covid19-api.org/api/timeline/${ctx.query.country}`);
    const countries = await Axios.get("https://covid19-api.org/api/countries");

    const fetchedData: CountryTimelineObject[] = data.data;

    let finalData: CountryTimelineObject[] = [];

    for (let i = 0; i < 64; i++) {
        finalData.push(fetchedData[i]);
    }

    return { data: finalData.sort((a, b) => new Date(a.last_update).getTime() - new Date(b.last_update).getTime()), lang: ctx.req.headers["accept-language"].split(",")[0], countries: countries.data };
};

export default GlobalOverview;
