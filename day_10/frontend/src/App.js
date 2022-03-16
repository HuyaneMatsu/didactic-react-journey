import {createElement as create_element} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import {LOGIN_STATE} from './login_state';
import {IndexPage} from './components/index_page';
import {ProfilePage} from './components/profile_page';
import {NotificationsPage} from './components/notifications_page';
import {LogoffPage} from './components/logoff_page';
import {StatsPage} from './components/stats_page';
import {AuthPage} from './components/auth_page';

export function App() {
    return (
        <Routes>
            <Route path='/' element={ <IndexPage /> } />
            <Route path='/profile' element={ redirect_if_not_logged_in(ProfilePage) } />
            <Route path='/stats' element={ redirect_if_not_logged_in(StatsPage) } />
            <Route path='/notifications' element={ redirect_if_not_logged_in(NotificationsPage) } />
            <Route path='/logoff' element={ redirect_if_not_logged_in(LogoffPage) } />
            <Route path='/auth' element={ <AuthPage /> } />
        </ Routes>
    );
}


function redirect_if_not_logged_in(component_type) {
    var parameters;
    if (LOGIN_STATE.is_logged_in) {
        parameters = null;
    } else {
        component_type = Navigate;
        parameters = {'to': '/', 'replace': true};
    }

    return create_element(
        component_type,
        parameters,
    );
}
