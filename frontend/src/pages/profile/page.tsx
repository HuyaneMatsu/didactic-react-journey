import {LOGIN_STATE, User} from './../../core';
import {to_string, format_date, set_title} from './../../utils';
import {Page} from './../../components';
import {ReactElement} from 'react';
import React from 'react';

export function ProfilePage(): ReactElement {
    var user = LOGIN_STATE.user as User;

    var content_element: ReactElement = (
        <div className='profile'>
            <div className='left'>
                <h1>{user.name }</h1>
                <p>{ 'id: ' + to_string(user.id) }</p>
                <p>{ 'Created at: ' + format_date(user.created_at) }</p>
            </div>
            <div className='right'>
                <img alt="avatar" src={ user.get_avatar_url_as(null, 512) } />
            </div>
        </div>
    );

    set_title('profile');

    return (
        <Page clicked={ 'profile' } content={ content_element } />
    );
}
