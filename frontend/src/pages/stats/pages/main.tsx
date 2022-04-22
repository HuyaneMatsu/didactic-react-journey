import {Link} from 'react-router-dom';
import React, {ReactElement} from 'react';
import {to_string, get_from_dict, set_title} from './../../../utils';
import {StatsPageSubProps} from './../../../structures';


export function StatsPageMain({data}: StatsPageSubProps): ReactElement {
    var streak: number = get_from_dict(data, 'streak', 0);

    var sell_streak_element: string | ReactElement;
    if (streak > 0) {
        sell_streak_element = (
            <Link className='hey_mister' to='./sell_streak'>
                { 'Hey mister! Want your sell your streak?' }
            </Link>
        );
    } else {
        sell_streak_element = '';
    }

    set_title('stats');

    return (
        <>
            <p>
                Hearts {to_string(get_from_dict(data, 'total_love', 0))}
            </p>
            <p>
                Streak {to_string(streak)}
            </p>
            { sell_streak_element }
        </>
    );
}
