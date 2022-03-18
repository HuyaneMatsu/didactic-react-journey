import {useMemo as memorise} from 'react';
import {useLocation as get_location} from 'react-router-dom';

function create_query_parameter_proxy(search) {
    return new URLSearchParams(search)
}

export function get_query() {
    const query_string = get_location().search;

    return memorise(
        () => create_query_parameter_proxy(query_string),
        [query_string],
    );
}
