export type UserData = {
    id: string,
    created_at: string,
    name : string,
    avatar_hash: string,
    avatar_type: number,
    discriminator: number,
}

export type DictionaryLike<Type> = Type & {
    [Property in keyof Type]: Type[Property];
}

/* {
    [Symbol.iterator]: [keyof Type, Type[keyof Type]];
}; */

export type NotificationData = DictionaryLike<{
    daily?: boolean,
    proposal?: boolean,
}>

export type StatsData = DictionaryLike<{
    streak?: number,
    total_love?: number,
}>

export type LoadingAPIData = NotificationData | StatsData;
export type LoadingAPIDataNullable = null | LoadingAPIData;

export type Nullable<DataType> = null | DataType;
