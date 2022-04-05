import {BrowserRouter as Router} from 'react-router-dom';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LOGIN_STATE} from './core';
import {to_string, set_query, clear_query, get_page_loader_api, remove_page_loader_api} from './utils';


export function render_in_router(component) {
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

function get_loader_api_and_set_data(endpoint, data, changes) {
    var page_loader_api = get_page_loader_api(endpoint);
    page_loader_api.set_data(data)

    if (changes !== null) {
        page_loader_api.data_changes = changes;
    }
}

function apply_keyword_parameters(keyword_parameters) {
    var applied;

    if (
        (keyword_parameters !== undefined) &&
        (keyword_parameters !== null ) &&
        (Object.keys(keyword_parameters).length !== 0)
    ) {
        applied = beforeAll(() => LOGIN_STATE.test_set_specific(keyword_parameters));

        var query = keyword_parameters['query']
        if (query !== undefined) {
            beforeAll(() => set_query(query));
            afterAll(clear_query);
        }

        var loader_api_endpoint = keyword_parameters['loader_api_endpoint'];
        if (loader_api_endpoint !== undefined) {
            afterAll(() => remove_page_loader_api(loader_api_endpoint));

            var loader_api_data = keyword_parameters['loader_api_data'];
            var loader_api_data_changes = keyword_parameters['loader_api_data_changes'];

            if ((loader_api_data !== undefined) || (loader_api_data_changes !== undefined)) {
                if (loader_api_data === undefined) {
                    loader_api_data = {};
                }

                if (loader_api_data_changes === undefined) {
                    loader_api_data_changes = null;
                }
                beforeAll(
                    () => get_loader_api_and_set_data(loader_api_endpoint, loader_api_data, loader_api_data_changes)
                );
            }

        }

    } else {
        applied = null;
    }

    return applied;
}


export function logged_off_test(description, function_, keyword_parameters) {
    return describe(
        'logged off',
        function () {
            beforeAll(logoff);
            beforeAll(clear_redirect);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        }
    )
}

export function logged_in_test(description, function_, keyword_parameters) {
    return describe(
        'logged in',
        function () {
            beforeAll(login);
            beforeAll(clear_redirect);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        }
    )
}


var REDIRECT = null;

export function set_redirect(redirect) {
    REDIRECT = redirect;
}

export function clear_redirect() {
    REDIRECT = null;
}

export function get_redirect() {
    return REDIRECT;
}


export function escape_regex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
