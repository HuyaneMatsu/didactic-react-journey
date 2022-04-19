import {useMemo as memorise} from 'react';
import {useLocation as get_location} from 'react-router-dom';

function create_query_parameter_proxy(search) {
    return new URLSearchParams(search)
}


class QueryType {
    query: Record<string, null | string>

    constructor(query: Record<string, null | string>) {
        this.query = query;
    }

    get(key: string) {
        var value = this.query[key];
        if (value === undefined) {
            value = null;
        }

        return value;
    }
}

var QUERY = null;

export function set_query(query: string) {
    QUERY = new QueryType(query);
}

export function clear_query() {
    QUERY = null;
}

export function get_query() {
    if (QUERY !== null) {
        return QUERY;
    }

    var query_string = get_location().search;

    return memorise(
        () => create_query_parameter_proxy(query_string),
        [query_string],
    );
}
