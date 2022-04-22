import {ReactElement} from 'react';
import {PageLoaderAPI}  from './../utils';

export type HeaderProps = {
    clicked: null | string,
};

export type ContentProps = {
    content: ReactElement | string,
};

export type PageProps = HeaderProps & ContentProps;

export type HeaderButtonProps = HeaderProps & {
    system_name: string,
    to: string,
    display_name: string,
};


export type ExceptionPageProps = {
    message : null | string,
    redirect_to: string,
};

export type LoadingPageProps = {
     title: null | string,
};

export type NotificationOptionProps = {
    page_loader_api: PageLoaderAPI,
    system_name: string,
    display_name: string,
}


export type SaveNotificationFieldProps = {
    page_loader_api: PageLoaderAPI,
}

export type StatsPageSubProps = {
    data: Record<string, any>,
}
