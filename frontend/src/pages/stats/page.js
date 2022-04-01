import {useEffect as use_effect} from 'react';
import {Route, Routes} from 'react-router-dom';

import {Header, Content, SpinningCircle} from './../../components';
import {get_page_loader_api, create_subscription} from './../../utils';

import {StatsPageSellDaily, StatsPageMain} from './pages';


export function StatsPage() {
    var subscription = create_subscription();
    var page_loader_api = get_page_loader_api('/stats')

    use_effect(subscription.get_subscriber_callback(page_loader_api), [])

    var content_element;
    if (page_loader_api.is_loaded) {
        var data = page_loader_api.data;

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
        <>
            <Header clicked={'stats'} />
            <Content content={ content_element } />
        </>
    );
}

StatsPage.propTypes = {};
