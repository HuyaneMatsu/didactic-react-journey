import {Content} from './content';
import {Header} from './header';
import {ReactElement} from 'react';
import React from 'react';


interface PageProps {
    clicked: null | string;
    content: ReactElement | string;
};


export function Page({clicked, content}: PageProps): ReactElement {
    return (
        <>
            <Header clicked={ clicked } />
            <Content content={ content } />
        </>
    );
}
