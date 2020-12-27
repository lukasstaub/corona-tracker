import React, { useState } from "react";
import { AppBar, Drawer, IconButton, List, ListItem, Toolbar, Typography } from "@material-ui/core";
import { Language } from "@material-ui/icons";
import { Country } from "../config";

const Navbar: React.FC<{ countries: Country[] }> = ({ countries }) => {
    const [openList, setOpenList] = useState(false);

    function goToCountry(country: Country) {
        setOpenList(false);
        setTimeout(() => {
            //@ts-expect-error
            window.location = `/details?country=${country.alpha2}`;
        }, 500);
    }

    return (
        <>
            <AppBar>
                <Toolbar>
                    <a href="/" style={{ color: "white", textDecoration: "none", flexGrow: 1 }}>
                        <Typography variant="h6">Corona-Tracker</Typography>
                    </a>

                    <IconButton color="inherit" onClick={() => setOpenList(true)}>
                        <Language />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer anchor="right" open={openList} onClose={() => setOpenList(false)}>
                <List>
                    {countries.map((country) => {
                        return (
                            <ListItem button key={country.name} onClick={() => goToCountry(country)}>
                                {country.name}
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
