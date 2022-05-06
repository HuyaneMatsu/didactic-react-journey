import {to_string} from './../core';
import {StatsData} from './../structures';


var STATS: Record<string, StatsData> = {
    '184734189386465281': {
        'total_love': 55566556,
        'streak': 222222,
    }
}

export function get_stats_of(user_id: bigint): StatsData {
    var string_user_id: string = to_string(user_id);
    var stats: undefined | StatsData = STATS[string_user_id];
    if (stats === undefined) {
        stats = {
            'total_love': 0,
            'streak': 0,
        } as StatsData;
    }
    return stats;
}

export function set_stats_of(user_id:bigint, stats: StatsData): void {
    var string_user_id: string = to_string(user_id);
    STATS[string_user_id] = stats;
}
