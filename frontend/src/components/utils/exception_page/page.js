import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Content} from './../../content';


export function ExceptionPage({message, redirect_to}) {
    var message_element;
    if (message === null) {
        message_element = '';
    } else {
        message_element = (
            <div className='message'>
                { message }
            </div>
        );
    }

    var content_element = (
        <div className='welcome'>
            { 'Something went wrong' }
            { message_element }
            <Link to={ redirect_to }>
                { 'Back to safety' }
            </Link>
        </div>
    );

    return (
        <>
            <nav className='header'></nav>
            <Content content={ content_element } />
        </>
    );
}

ExceptionPage.propTypes = {
    'message': PropTypes.oneOfType([PropTypes.string.isRequired]),
    'redirect_to': PropTypes.string.isRequired,
};
