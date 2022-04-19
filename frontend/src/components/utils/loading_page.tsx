import {Content} from './../content';

import {SpinningCircle} from './spinning_circle';


export var TEST_ID_LOADING_PAGE_HEADER = 'loading_page';


interface LoadingPageProps {
    title: null | string;
};



export function LoadingPage({title}: LoadingPageProps) {
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
