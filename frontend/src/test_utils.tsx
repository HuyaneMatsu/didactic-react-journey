import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom';
import {ReactElement} from 'react';
import {render, RenderResult} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LOGIN_STATE} from './core';
import {to_string, set_query, clear_query, clear_handlers, get_handler} from './utils';


export function render_in_router(component: string): RenderResult {
    return render( <Routed component={ component } /> );
}

type RoutedProps = {
    component: string | ReactElement,
}

function Routed({component}: RoutedProps): ReactElement {
    return (
        <Router>
            { component }
        </Router>
    );
}


function logoff(): void {
    LOGIN_STATE.clear();
}

function login(): void {
    LOGIN_STATE.test_set_random();
}

function get_handler_and_set_result(
    custom_id: string,
    handler_result: null | unknown,
): void {
    get_handler(custom_id).set_result(handler_result);
}

function apply_keyword_parameters(keyword_parameters: undefined | null | Record<string, any>): null | any {
    var applied: object | null;

    if (
        (keyword_parameters !== undefined) &&
        (keyword_parameters !== null ) &&
        (Object.keys(keyword_parameters).length !== 0)
    ) {
        applied = beforeAll(() => LOGIN_STATE.test_set_specific(keyword_parameters));

        var query = keyword_parameters['query'];
        if (query !== undefined) {
            beforeAll(() => set_query(query));
            afterAll(clear_query);
        }

        var handler_custom_id: undefined | string = keyword_parameters['handler_custom_id'] as undefined | string;
        if (handler_custom_id !== undefined) {
            afterAll(() => clear_handlers());

            var handler_result: undefined | unknown = keyword_parameters['handler_result'];
            if (handler_result === undefined) {
                handler_result = null;
            }
            
            beforeAll(
                () => get_handler_and_set_result(handler_custom_id as string, handler_result)
            );

        }

    } else {
        applied = null;
    }

    return applied;
}


export function logged_off_test(
    description: string,
    function_: () => any,
    keyword_parameters?: undefined | null | Record<string, any>
): null | any {
    return describe(
        'logged off',
        function (): void {
            beforeAll(logoff);
            beforeAll(clear_redirect);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        },
    );
}

export function logged_in_test(
    description: string,
    function_: () => any,
    keyword_parameters?: undefined | null | Record<string, any>,
): null | any {
    return describe(
        'logged in',
        function (): void {
            beforeAll(login);
            beforeAll(clear_redirect);
            apply_keyword_parameters(keyword_parameters);
            afterAll(logoff);
            test(description, function_);
        },
    );
}


var REDIRECT: null | string = null;

export function set_redirect(redirect: string): void {
    REDIRECT = redirect;
}

export function clear_redirect(): void {
    REDIRECT = null;
}

export function get_redirect(): null | string {
    return REDIRECT;
}


export function escape_regex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sleep(seconds: number): Promise<void> {
    return new Promise(
        resolve => setTimeout(resolve, seconds * 1000.0)
    )
}
