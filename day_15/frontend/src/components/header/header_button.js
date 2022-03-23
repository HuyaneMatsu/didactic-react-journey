import {Link} from 'react-router-dom';
import {createElement as create_element} from 'react';

import {LOGIN_STATE} from './../../core';


export function HeaderButton({system_name, to, display_name, clicked}) {
    var element_attributes = {};
    var element_type;

    if (LOGIN_STATE.is_logged_in) {
        if (system_name == clicked) {
            element_attributes['className'] = 'clicked';
            element_type = 'a'
        } else {
            element_attributes['to'] = to;
            element_type = Link;
        }

    } else {
        element_attributes['className'] = 'disabled';
        element_type = 'a'
    }

    return create_element(
        element_type,
        element_attributes,
        display_name,
    );
}
