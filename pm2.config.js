module.exports = {
    apps: [
        {
            name: "corona-tracker",
            script: "./server.js",
            watch: true,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
