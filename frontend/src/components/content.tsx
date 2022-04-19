export var TEST_ID_CONTENT = 'content';

interface ContentProps {
    content: object | string;
};


export function Content({content}: ContentProps) {
    return (
        <div className='content' data-testid={ TEST_ID_CONTENT }>
            { content }
        </div>
    );
}
