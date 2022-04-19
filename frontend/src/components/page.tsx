import {Content} from './content';
import {Header} from './header';

interface PageProps {
    clicked: null | string;
    content: object | string;
};

export function Page({clicked, content}: PageProps) {
    return (
        <>
            <Header clicked={ clicked } />
            <Content content={ content } />
        </>
    );
}
