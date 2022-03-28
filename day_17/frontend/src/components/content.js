import PropTypes from 'prop-types';

export function Content({content}) {
    return (
        <div className='content'>
            { content }
        </div>
    );
}

Content.propTypes = {
    'content': PropTypes.node.isRequired,
};
