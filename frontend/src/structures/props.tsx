import {ReactElement} from 'react';
import {NotificationData, StatsData} from './data';
import {NotificationHolder, StatHolder} from './../pages';
import {RequestLifeCycleHandler} from './../utils';


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
    notification_holder: NotificationHolder,
    handler: RequestLifeCycleHandler,
    system_name: keyof NotificationData,
    display_name: string,
}


export type SaveNotificationFieldProps = {
    notification_holder: NotificationHolder,
    parent_handler: RequestLifeCycleHandler;
}

export type StatsPageSubProps = {
    data: StatsData,
}

export type StatsPageSellDailyProps = {
    data: StatsData,
    stat_holder: null | StatHolder;
}
