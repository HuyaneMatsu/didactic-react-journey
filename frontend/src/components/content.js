import PropTypes from 'prop-types';

export var CONTENT_TEST_ID = 'content';

export function Content({content}) {
    return (
        <div className='content' data-testid={ CONTENT_TEST_ID }>
            { content }
        </div>
    );
}

Content.propTypes = {
    'content': PropTypes.node.isRequired,
};
