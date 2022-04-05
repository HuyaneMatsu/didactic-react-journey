import {set_redirect} from './../test_utils';
var react_router_dom = jest.requireActual('react-router-dom')

export var Navigate = react_router_dom.Navigate;
export var useLocation = react_router_dom.useLocation;
export var BrowserRouter = react_router_dom.BrowserRouter;
export var Link = react_router_dom.Link;
export var Routes = react_router_dom.Routes;
export var Route = react_router_dom.Route;

export var useNavigate = () => ((redirect) => set_redirect(redirect))
