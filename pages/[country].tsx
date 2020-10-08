import React from "react";
import { NextPage } from "next";
import Axios from "axios";
import { Country } from "../src/config";

const CountryRedirect: NextPage = () => {
    return <div></div>;
};

CountryRedirect.getInitialProps = async (ctx) => {
    const countries: { data: Country[] } = await Axios.get("https://covid19-api.org/api/countries");

    //@ts-expect-error
    const country = countries.data.find((el) => el.name.toLowerCase() === ctx.query.country!.toLowerCase() || el.alpha2.toLocaleLowerCase() === ctx.query.country!.toLowerCase() || el.alpha3.toLowerCase() === ctx.query.country!.toLowerCase());

    if (country) {
        ctx.res.writeHead(302, {
            Location: `/details?country=${country.alpha2}`,
        });
        ctx.res.end();
        return;
    } else {
        ctx.res.writeHead(302, {
            Location: "/",
        });
        ctx.res.end();
        return;
    }

    return {};
};

export default CountryRedirect;
