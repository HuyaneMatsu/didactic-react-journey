import {createElement as create_element, Fragment} from 'react';

import {LOGIN_STATE} from './../../core';
import {to_string, format_date} from './../../utils';
import {Header, create_content} from './../../components';


export function ProfilePage() {
    var content_element =  (
        <div className='profile'>
            <div className='left'>
                <h1>{ LOGIN_STATE.user.name }</h1>
                <p>{ 'id: ' + to_string(LOGIN_STATE.user.id) }</p>
                <p>{ 'Created at: ' + format_date(LOGIN_STATE.user.created_at) }</p>
            </div>
            <div className='right'>
                <img src={ LOGIN_STATE.user.get_avatar_url_as(null, 512) } />
            </div>
        </div>
    );

    return (
        <>
            <Header clicked={ 'profile' } />
            { create_content(content_element) }
        </>
    );
}

ProfilePage.propTypes = {};
