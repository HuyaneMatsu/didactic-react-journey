import {Link} from 'react-router-dom';
import React, {createElement as create_element, ReactElement, JSXElementConstructor} from 'react';
import PropTypes from 'prop-types';
import {LOGIN_STATE} from './../../core';


export var TEST_ID_HEADER_NAVIGATOR_BUTTON: string = 'navigator_button';

interface HeaderButtonProps {
    system_name : string;
    to: string;
    display_name: string;
    clicked: null | string;
}

export function HeaderButton({system_name, to, display_name, clicked}: HeaderButtonProps): ReactElement {
    var element_attributes: Record<string, any> = {
        'data-testid': TEST_ID_HEADER_NAVIGATOR_BUTTON,
    };
    var element_type: JSXElementConstructor<any> | string;

    if (LOGIN_STATE.is_logged_in) {
        if (system_name === clicked) {
            element_attributes['className'] = 'clicked';
            element_attributes['tabIndex'] = '0';
            element_type = 'a';
        } else {
            element_attributes['to'] = to;
            element_type = Link;
        }

    } else {
        element_attributes['className'] = 'disabled';
        element_attributes['tabIndex'] = '0';
        element_type = 'a';
    }

    return create_element(
        element_type,
        element_attributes,
        display_name,
    );
}

HeaderButton.propTypes = {
    'system_name': PropTypes.string.isRequired,
    'to': PropTypes.string.isRequired,
    'display_name': PropTypes.string.isRequired,
    'clicked': PropTypes.oneOfType([PropTypes.string.isRequired]),
};
