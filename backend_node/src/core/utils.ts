import {DISCORD_EPOCH} from './constants';

export function id_to_datetime(id_: bigint): Date {
    return new Date(Number(((id_ >> BigInt(22)) + DISCORD_EPOCH) / BigInt(1000)))
}

export function datetime_to_timestamp(date_time: Date): string {
    return date_time.toISOString();
}

export function now_as_id(): bigint {
    var now_date: Date = new Date();
    var now_unix: number = Math.floor(now_date.getTime());
    var now_int: bigint = BigInt(now_unix);

    return (now_int - DISCORD_EPOCH) << BigInt(22);
}
