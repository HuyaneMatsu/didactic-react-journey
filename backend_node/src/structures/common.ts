export type DictionaryLike<Type> = Type & {
    [Property in keyof Type]: Type[Property];
}

export type NotificationData = DictionaryLike<{
    daily?: boolean,
    proposal?: boolean,
}>

export type StatsData = DictionaryLike<{
    streak?: number,
    total_love?: number,
}>
