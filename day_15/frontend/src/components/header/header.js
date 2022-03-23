import {HeaderButton} from './header_button';
import {LoginButton} from './login_button';


export function Header({clicked}) {
    return (
        <nav className='header'>

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
