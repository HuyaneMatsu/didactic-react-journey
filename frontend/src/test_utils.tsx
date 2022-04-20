import {BrowserRouter as Router} from 'react-router-dom';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LOGIN_STATE} from './core';
import {to_string, set_query, clear_query, get_page_loader_api, remove_page_loader_api} from './utils';


export function render_in_router(component: object) {
    return render( <Routed component={ component } /> );
}

interface RoutedProps {
    component: string | object;
}

function Routed({component}: RoutedProps) {
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

function get_loader_api_and_set_data(endpoint: string, data: null | undefined | object, changes: null | object) {
    var page_loader_api = get_page_loader_api(endpoint, data);

    if (changes !== null) {
        page_loader_api.data_changes = changes;
    }
}

function apply_keyword_parameters(keyword_parameters: object) {
    var applied: object | null;

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


export function logged_off_test(description: string, function_: object, keyword_parameters: undefined | object) {
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

export function logged_in_test(description: string, function_: object, keyword_parameters: undefined | object) {
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

export function set_redirect(redirect: string) {
    REDIRECT = redirect;
}

export function clear_redirect() {
    REDIRECT = null;
}

export function get_redirect() {
    return REDIRECT;
}


export function escape_regex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sleep(seconds: number) {
    return new Promise(
        resolve => setTimeout(resolve, seconds * 1000.0)
    )
}
