module.exports = {
    apps : [{
        name   : "perp",
        script : "./start.sh",
        env_production: {
            L2_WEB3_ENDPOINTS: "https://optimism-mainnet.infura.io/v3/8f8bfe57ab9e4ced96813ab9896a2f3"
        },
        env_development: {
            L2_WEB3_ENDPOINTS: "https://optimism-mainnet.infura.io/v3/8f8bfe57ab9e4ced96813ab9896a2f3"
        },
    }]
}
