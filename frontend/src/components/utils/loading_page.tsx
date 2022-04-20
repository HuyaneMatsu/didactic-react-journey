import {Content} from './../content';
import {ReactElement} from 'react';
import {SpinningCircle} from './spinning_circle';
import React from 'react';


export var TEST_ID_LOADING_PAGE_HEADER: string = 'loading_page';


interface LoadingPageProps {
    title: null | string;
};



export function LoadingPage({title}: LoadingPageProps): ReactElement {
    var header_content: ReactElement | string;
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
