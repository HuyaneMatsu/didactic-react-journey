import {Content} from './../../content';
import {ExceptionPageContent} from './content';
import React, {ReactElement} from 'react';
import {ExceptionPageProps} from './../../../structures';


export function ExceptionPage({message, redirect_to}: ExceptionPageProps): ReactElement {
    var content_element: ReactElement = (
        <ExceptionPageContent message={ message } redirect_to={ redirect_to } />
    )

    return (
        <>
            <nav className='header'></nav>
            <Content content={ content_element } />
        </>
    );
}
