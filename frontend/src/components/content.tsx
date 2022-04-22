import React, {ReactElement} from 'react';
import {ContentProps} from './../structures';


export var TEST_ID_CONTENT: string = 'content';


export function Content({content}: ContentProps): ReactElement {
    return (
        <div className='content' data-testid={ TEST_ID_CONTENT }>
            { content }
        </div>
    );
}
