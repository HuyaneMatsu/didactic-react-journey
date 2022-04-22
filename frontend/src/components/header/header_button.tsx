import {Link} from 'react-router-dom';
import React, {createElement as create_element, ReactElement} from 'react';
import {LOGIN_STATE} from './../../core';
import {HeaderButtonProps, ElementType} from './../../structures';

export var TEST_ID_HEADER_NAVIGATOR_BUTTON: string = 'navigator_button';


export function HeaderButton({system_name, to, display_name, clicked}: HeaderButtonProps): ReactElement {
    var element_attributes: Record<string, any> = {
        'data-testid': TEST_ID_HEADER_NAVIGATOR_BUTTON,
    };
    var element_type: ElementType;

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
