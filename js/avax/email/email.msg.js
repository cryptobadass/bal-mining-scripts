const EMAIL_MSG = {
    // starting running basic data
    START_INIT_BASIC_DATA: {
        SUBJECT: 'Init basic data',
        CONTENT:
            '<p>Start running schedule to init basic data </p>' +
            '<p>' +
            new Date() +
            '</p>',
    },
    INIT_BASIC_DATA_ERROR: {
        SUBJECT: 'Init basic data error',
        CONTENT: '<p>Init basic data error </p>' + '<p>' + new Date() + '</p>',
    },
    CHECK_DATA_NOT_FOUND: {
        SUBJECT: 'Check basic data - Not found',
        CONTENT:
            "<p>Not found today's data, please fix the problem</p>" +
            '<p>' +
            new Date() +
            '</p>',
    },
    CHECK_DATA_FOUND: {
        SUBJECT: 'Check basic data - success',
        CONTENT:
            ' records found. Running basic data success.</p>' +
            '<p>' +
            new Date() +
            '</p>',
    },
};

module.exports = {
    EMAIL_MSG,
};
