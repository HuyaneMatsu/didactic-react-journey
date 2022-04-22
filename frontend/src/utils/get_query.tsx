import {useMemo as memorise} from 'react';
import {useLocation as get_location} from 'react-router-dom';
import {QueryType} from './../structures';


function create_query_parameter_proxy(search: string): URLSearchParams {
    return new URLSearchParams(search)
}


class Query {
    query: Record<string, null | string>

    constructor(query: Record<string, null | string>) {
        this.query = query;
    }

    get(key: string): null | string {
        var value = this.query[key];
        if (value === undefined) {
            value = null;
        }

        return value;
    }
}

var QUERY: null | Query = null;

export function set_query(query: Record<string, null | string>) {
    QUERY = new Query(query);
}

export function clear_query() {
    QUERY = null;
}

export function get_query(): QueryType{
    if (QUERY !== null) {
        return QUERY;
    }

    var query_string = get_location().search;

    return memorise(
        () => create_query_parameter_proxy(query_string),
        [query_string],
    );
}
