import {Link} from 'react-router-dom';
import React, {ReactElement} from 'react';
import {ExceptionPageProps} from './../../../structures';


export function ExceptionPageContent({message, redirect_to}: ExceptionPageProps): ReactElement {
    var message_element: ReactElement | string;
    if (message === null) {
        message_element = '';
    } else {
        message_element = (
            <div className='message'>
                { message }
            </div>
        );
    }

    return (
        <div className='welcome'>
            { 'Something went wrong' }
            { message_element }
            <Link to={ redirect_to }>
                { 'Back to safety' }
            </Link>
        </div>
    );
}
