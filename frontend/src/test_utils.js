import {BrowserRouter as Router} from 'react-router-dom';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LOGIN_STATE} from './core';


export function render_in_router(component) {
    return render(
        <Router>
            { component }
        </Router>
    );
}


function logoff() {
    LOGIN_STATE.clear();
}

function login() {
    LOGIN_STATE.set_random();
}


export function logged_off_test(description, function_) {
    return describe(
        'logged off',
        function() {
            beforeAll(logoff);
            test(description, function_);
        }
    )
}

export function logged_in_test(description, function_) {
    return describe(
        'logged in',
        function() {
            beforeAll(login);
            afterAll(logoff);
            test(description, function_);
        }
    )
}
