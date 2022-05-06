import {to_string} from './../core';
import {NotificationData} from './../structures';


var NOTIFICATION_SETTINGS: Record<string, NotificationData> = {
    '184734189386465281': {
        'daily': false,
    }
}

export function get_notification_settings_of(user_id: bigint): NotificationData {
    var string_user_id: string = to_string(user_id);
    var notification_settings: undefined | NotificationData = NOTIFICATION_SETTINGS[string_user_id];
    if (notification_settings === undefined) {
        notification_settings = {} as NotificationData;
    }
    return notification_settings;
}

export function set_notification_settings_of(user_id: bigint, notification_settings: NotificationData): void {
    var string_user_id: string = to_string(user_id);
    NOTIFICATION_SETTINGS[string_user_id] = notification_settings;
}
