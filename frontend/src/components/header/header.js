import PropTypes from 'prop-types';

import {HeaderButton} from './header_button';
import {LoginButton} from './login_button';


export var TEST_ID_HEADER = 'navigator';


export function Header({clicked}) {
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

Header.propTypes = {
    'clicked': PropTypes.oneOfType([PropTypes.string.isRequired]),
};
