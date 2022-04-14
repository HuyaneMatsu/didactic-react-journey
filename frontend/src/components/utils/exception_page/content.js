import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export function ExceptionPageContent({message, redirect_to}) {
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

    return (
        <div className='welcome'>
            { 'Something went wrong' }
            { message_element }
            <Link to={ redirect_to }>
                { 'Back to safety' }
            </Link>
        </div>
    );
}

ExceptionPageContent.propTypes = {
    'message': PropTypes.oneOfType([PropTypes.string.isRequired]),
    'redirect_to': PropTypes.string.isRequired,
};
