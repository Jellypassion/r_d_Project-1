const common = {
    loader: ['ts-node/esm'],
    paths: ['features/**/*.feature'],
    format: [
        '@cucumber/pretty-formatter',
    ],
    formatOptions: {
        snippetInterface: "async-await",
    },
    import: ['src/**/*.ts'],
    tags: "not @skip"
};

const ci = {
    ...common,
    format: [
        ...common.format,
        'json:./reports/cucumber.json',
        'html:./reports/cucumber-embedded.html',
        'junit:./reports/cucumber.xml'
    ],
    formatOptions: {
        ...common.formatOptions,
    },
    retry: 3
};

const local = {
    ...ci,
    retry: 0
};

module.exports = {
    default: common,
    ci: ci,
    local: local
};