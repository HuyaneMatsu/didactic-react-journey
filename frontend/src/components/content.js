import PropTypes from 'prop-types';

export var TEST_ID_CONTENT = 'content';

export function Content({content}) {
    return (
        <div className='content' data-testid={ TEST_ID_CONTENT }>
            { content }
        </div>
    );
}

Content.propTypes = {
    'content': PropTypes.node.isRequired,
};
