import PropTypes from 'prop-types';

import {Content} from './../content';

import {SpinningCircle} from './spinning_circle';


export var TEST_ID_LOADING_PAGE_HEADER = 'loading_page';

export function LoadingPage({title}) {

    var header_content;
    if (title === null) {
        header_content = '';
    } else {
        header_content = (
            <div className='middle'>
                { title }
            </div>
        )
    }


    return (
        <>
            <nav className='header' data-testid={ TEST_ID_LOADING_PAGE_HEADER }>
                { header_content }
            </nav>

            <Content content={ <SpinningCircle /> } />
        </>
    );
}

LoadingPage.propTypes = {
    'title': PropTypes.oneOfType([PropTypes.string.isRequired]),
};
