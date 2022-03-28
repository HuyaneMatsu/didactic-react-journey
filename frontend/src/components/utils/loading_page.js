import {create_loader} from './loader';
import {Content} from './../content';


export function create_loading_page(title) {
    return (
        <>
            <nav className='header'>
                <div className='middle'>
                    { title }
                </div>
            </nav>

            <Content content={ create_loader() } />
        </>
    );
}
