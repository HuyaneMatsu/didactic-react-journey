import {createElement as create_element, useEffect as use_effect} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import {LOGIN_STATE} from './core';
import {MainPage, ProfilePage, NotificationsPage, LogoffPage, StatsPage, AuthPage} from './pages';
import {create_subscription} from './utils';
import {create_loading_page} from './components';


export function App() {
    var subscription = create_subscription();
    use_effect(subscription.get_subscriber_callback(LOGIN_STATE), [])

    var element;
    if (LOGIN_STATE.logging_in) {
        element = create_loading_page('Logging in');
    } else {
        element = (
            <Routes>
                <Route path='/' element={ <MainPage /> } />
                <Route path='/profile' element={ redirect_if_not_logged_in(ProfilePage) } />
                <Route path='/stats/*' element={ redirect_if_not_logged_in(StatsPage) } />
                <Route path='/notifications' element={ redirect_if_not_logged_in(NotificationsPage) } />
                <Route path='/logoff' element={ redirect_if_not_logged_in(LogoffPage) } />
                <Route path='/auth' element={ <AuthPage /> } />
            </ Routes>
        );
    }

    return element;
}

App.propTypes = {};


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
