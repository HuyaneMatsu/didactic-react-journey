import {DictionaryLike} from './common';
import {ICON_TYPE} from './../core';

export type FrontendUserData = DictionaryLike<{
    id: string,
    name: string,
    created_at: string,
    avatar_hash: string,
    avatar_type: ICON_TYPE,
    discriminator: number,
}>
