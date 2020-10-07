import { useMemo } from "react";
import type { AppProps } from "next/app";
import { createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery } from "@material-ui/core";

import { deepPurple } from "@material-ui/core/colors";

import "../styles/index.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const isMobile = useMediaQuery("only screen and (max-width: 599px)");

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light",
                    primary: {
                        main: deepPurple[700],
                    },
                },
            }),
        [prefersDarkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ paddingTop: isMobile ? 56 : 64 }}>
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    );
};

export default MyApp;
