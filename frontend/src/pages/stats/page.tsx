import React, {useEffect as use_effect, ReactElement} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Page, SpinningCircle} from './../../components';
import {get_page_loader_api, create_subscription, Subscription, PageLoaderAPI} from './../../utils';
import {StatsPageSellDaily, StatsPageMain} from './pages';


export function StatsPage(): ReactElement {
    var subscription: Subscription = create_subscription();
    var page_loader_api: PageLoaderAPI = get_page_loader_api('/stats');

    use_effect(subscription.get_subscriber_callback(page_loader_api), [])

    var content_element: ReactElement | string;
    if (page_loader_api.is_loaded) {
        var data = page_loader_api.data as Record<string, any>;

        content_element = (
            <div className="stats">
                <Routes>
                    <Route path='/' element={ <StatsPageMain data={data} /> }/>
                    <Route path='/sell_streak' element={<StatsPageSellDaily data={data} /> }/>
                </Routes>
            </div>
        );
    } else {
        content_element = <SpinningCircle />;
    }

    return (
        <Page clicked={'stats'} content={ content_element } />
    );
}
