import {HeaderButton} from './header_button';
import {LoginButton} from './login_button';
import React, {ReactElement} from 'react';
import {HeaderProps} from './../../structures';

export var TEST_ID_HEADER: string = 'navigator';

export function Header({clicked}: HeaderProps): ReactElement {
    return (
        <nav className='header' data-testid={ TEST_ID_HEADER }>
            <div className='left'>
                <HeaderButton
                    system_name={ 'profile'}
                    to={ '/profile' }
                    display_name={ 'Profile' }
                    clicked={ clicked }
                />
                <HeaderButton
                    system_name={ 'stats'}
                    to={ '/stats' }
                    display_name={ 'Stats' }
                    clicked={ clicked }
                />
                <HeaderButton
                    system_name={ 'notifications'}
                    to={ '/notifications' }
                    display_name={ 'Notifications' }
                    clicked={ clicked }
                />
            </div>

            <div className='right'>
                <LoginButton />
            </div>
        </nav>
    );
}
