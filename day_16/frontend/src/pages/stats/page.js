import {useEffect as use_effect} from 'react';
import {Route, Routes} from 'react-router-dom';

import {Header, Content, create_loader} from './../../components';
import {get_loaded_page_api, create_subscription} from './../../utils';

import {StatsPageSellDaily, StatsPageMain} from './pages';


export function StatsPage() {
    var subscription = create_subscription();
    var loaded_page_api = get_loaded_page_api('/stats')

    use_effect(subscription.get_subscriber_callback(loaded_page_api), [])

    var content_element;
    if (loaded_page_api.is_loaded) {
        var data = loaded_page_api.data;

        content_element = (
            <div className="stats">
                <Routes>
                    <Route path='/' element={ <StatsPageMain data={data} /> }/>
                    <Route path='/sell_streak' element={<StatsPageSellDaily data={data} /> }/>
                </Routes>
            </div>
        );
    } else {
        content_element = create_loader();
    }

    return (
        <>
            <Header clicked={'stats'} />
            <Content content={ content_element } />
        </>
    );
}

StatsPage.propTypes = {};
