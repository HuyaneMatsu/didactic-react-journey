import {Content} from './content';
import {Header} from './header';
import React, {ReactElement} from 'react';
import {PageProps} from './../structures';


export function Page({clicked, content}: PageProps): ReactElement {
    return (
        <>
            <Header clicked={ clicked } />
            <Content content={ content } />
        </>
    );
}
