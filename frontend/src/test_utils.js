import {BrowserRouter as Router} from 'react-router-dom';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LOGIN_STATE} from './core';
import {to_string} from './utils';

export function render_in_router(component){
    return render( <Routed component={ component } /> );
}

function Routed({component, run_id}) {
    return (
        <Router>
            { component }
        </Router>
    );
}


function logoff() {
    LOGIN_STATE.clear();
}

function login() {
    LOGIN_STATE.test_set_random();
}

function apply_keyword_parameters(keyword_parameters) {
    var applied;

    if (
        (keyword_parameters !== undefined) &&
        (keyword_parameters !== null ) &&
        (Object.keys(keyword_parameters).length !== 0)
    ) {
        applied = beforeAll(() => LOGIN_STATE.test_set_specific(keyword_parameters));
    } else {
        applied = null;
    }

    return applied;
}


export function logged_off_test(description, function_, keyword_parameters) {
    return describe(
        'logged off',
        function() {
            beforeAll(logoff);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        }
    )
}

export function logged_in_test(description, function_, keyword_parameters) {
    return describe(
        'logged in',
        function() {
            beforeAll(login);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        }
    )
}
