import {createElement as create_element} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import {LOGIN_STATE} from './login_state';
import {IndexPage} from './components/index_page';
import {ProfilePage} from './components/profile_page';
import {NotificationsPage} from './components/notifications_page';
import {LogoffPage} from './components/logoff_page';
import {StatsPage} from './components/stats_page';

export default function App() {
    return create_element(
        Router,
        null,
        create_element(
            Routes,
            null,
            create_element(
                Route,
                {
                    'path': '/',
                    'element': create_element(IndexPage, null),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/profile',
                    'element': redirect_if_not_logged_in(ProfilePage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/stats',
                    'element': redirect_if_not_logged_in(StatsPage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/notifications',
                    'element': redirect_if_not_logged_in(NotificationsPage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/logoff',
                    'element': redirect_if_not_logged_in(LogoffPage),
                },
            ),
        ),
    );
}


function redirect_if_not_logged_in(component) {
    if (LOGIN_STATE.is_logged_in) {
        return create_element(
            component,
            null,
        );
    } else {
        return create_element(
            Navigate,
            {'to': '/', 'replace': true},
        );
    }
}
