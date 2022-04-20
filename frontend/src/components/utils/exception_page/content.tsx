import {Link} from 'react-router-dom';
import React, {ReactElement} from 'react';

interface ExceptionPageContentProps {
    message : null | string;
    redirect_to: string;
}

export function ExceptionPageContent({message, redirect_to}: ExceptionPageContentProps): ReactElement {
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
