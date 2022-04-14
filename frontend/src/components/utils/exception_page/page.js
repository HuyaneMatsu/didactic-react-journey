import PropTypes from 'prop-types';
import {Content} from './../../content';
import {ExceptionPageContent} from './content';

export function ExceptionPage({message, redirect_to}) {
    var content_element = (
        <ExceptionPageContent message={ message } redirect_to={ redirect_to } />
    )

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
