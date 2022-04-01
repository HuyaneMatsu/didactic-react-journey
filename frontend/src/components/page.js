import PropTypes from 'prop-types';

import {Content} from './content';
import {Header} from './header';

export function Page({clicked, content}) {
    return (
        <>
            <Header clicked={ clicked } />
            <Content content={ content } />
        </>
    );
}

Page.propTypes = {
    'clicked': PropTypes.oneOfType([PropTypes.string.isRequired]),
    'content': PropTypes.node.isRequired,
};
