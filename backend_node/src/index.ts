import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';

import {} from './core';
import {} from './helpers';
import {} from './routes';
import {} from './structures';
import {} from './utils';
import {FRONTEND_URL} from './constants';


import {
    api_user_router, api_stats_router, api_notification_settings_router, api_sell_daily_router, root_login_router,
    api_auth_router
} from './routes';


var APP: Application = express();
var PORT: number = 5000;

APP.use(express.json());
APP.use(express.urlencoded({'extended': false}));


APP.use(
    function set_headers(request: Request, response: Response, next: () => void) {
        response.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
        response.setHeader('Access-Control-Allow-Methods', '*')
        response.setHeader('Access-Control-Allow-Headers', '*')
        response.setHeader('Vary', 'Origin')

        next();
    }
);


APP.use('/api', api_user_router);
APP.use('/api', api_stats_router);
APP.use('/api', api_notification_settings_router);
APP.use('/api', api_sell_daily_router);
APP.use('/api', api_auth_router);
APP.use('/', root_login_router);


// starts the Express server
APP.listen(
    PORT,
    function log_start() {
        console.log(`server started at http://127.0.0.1:${ PORT }`);
    }
);
