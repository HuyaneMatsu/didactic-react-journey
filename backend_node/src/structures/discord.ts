import {DictionaryLike} from './common';


export type UserData = DictionaryLike<{
    id: string,
    username?: string,
    name?: string,
    discriminator?: string,
    avatar?: null | string,
    banner?: null | string,
    accent_color?: null | number,
}>


export type OA2AccessData = DictionaryLike<{
    access_token: string,
    refresh_token?: string,
    expires_in: number,
    scope: string,
}>
