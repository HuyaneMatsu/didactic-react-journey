import {create_loader} from './loader';
import {create_content} from './content';


export function create_loading_page(title) {
    return (
        <>
            <nav className='header'>
                <div className='middle'>
                    { title }
                </div>
            </nav>

            { create_content(create_loader()) }
        </>
    )
}
