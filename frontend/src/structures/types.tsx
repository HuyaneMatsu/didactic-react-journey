import {JSXElementConstructor} from 'react';


export type QueryType = {
    get: (key: string) => null | string;
}

export type ElementType = JSXElementConstructor<any> | string;
