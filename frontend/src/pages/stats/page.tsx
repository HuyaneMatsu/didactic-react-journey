import React, {useEffect as use_effect, ReactElement} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Page, SpinningCircle} from './../../components';
import {get_handler, create_subscription, Subscription, RequestLifeCycleHandler} from './../../utils';
import {StatsPageSellDaily, StatsPageMain} from './pages';
import {StatsData} from './../../structures';
import {should_reload_stats, request_stats} from './loading';
import {StatHolder} from './types';
import {ENDPOINT_STATS} from './constants';


export function StatsPage(): ReactElement {
    var subscription: Subscription = create_subscription();
    var handler: RequestLifeCycleHandler = get_handler(ENDPOINT_STATS);

    if (should_reload_stats(handler)) {
        request_stats(handler);
    }

    use_effect(subscription.get_subscriber_callback(handler), []);



    var data: null | StatsData;
    var stat_holder: null | StatHolder = handler.get_result() as null | StatHolder;

    if (stat_holder === null) {
        data = null;
    } else {
        data = stat_holder.get_data();
    }


    var content_element: ReactElement | string;

    if (data === null) {
        content_element = <SpinningCircle />;

    } else {
        content_element = (
            <div className="stats">
                <Routes>
                    <Route path='/' element={ <StatsPageMain data={data} /> }/>
                    <Route path='/sell_streak' element={<StatsPageSellDaily data={data} stat_holder={stat_holder}/> }/>
                </Routes>
            </div>
        );
    }

    return (
        <Page clicked={'stats'} content={ content_element } />
    );
}
