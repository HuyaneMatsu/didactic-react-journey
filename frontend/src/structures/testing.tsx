import {User} from './../core/entities/user';


export type TestSetSpecificKeywordParameters = {
    logged_in?: boolean,
    user?: null | User,
    token?: null | string,
    was_logged_in?: boolean,
    is_logged_in?: boolean,
    un_authorized?: boolean,
}
