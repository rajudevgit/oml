'use strict';

const path = require('path');
const uscore = require('underscore');

const commonConfig = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 50071,
    pagination: {
        numPerPage: 30,
        maxSize: 10
    },
    secret_key: 'A1SJawnHGR3DQr7SrVKtyohpDvwxez5g',
    session: null,
    request: {
        limit: '10mb'
    }
};

module.exports = commonConfig;