/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

function get_from_nullable_dict(dictionary, key, default_value) {
    if (dictionary === null) {
        return default_value;
    }

    value = dictionary[key];
    if (value === undefined) {
        return default_value;
    }

    return value;
}

function choice(list_) {
    return list_[Math.floor(Math.random() * list_.length)]
}

var create_element = React.createElement;
var Component = React.Component;
var Fragment = React.Fragment;
var state_hook = React.useState;
var reference_hook = React.useRef;
var use_effect = React.useEffect;

var Link = ReactRouterDOM.Link;
var Router = ReactRouterDOM.BrowserRouter;
var Routes = ReactRouterDOM.Routes;
var Route = ReactRouterDOM.Route;
var get_navigator = ReactRouterDOM.useNavigate;
var Navigate = ReactRouterDOM.Navigate;

/* Define globals */

var API_BASE_URL = document.location.origin + '/api'

/* Utility functions */


function to_string(value) {
    return value.toString();
}

function to_string_base_16(value) {
    return value.toString(16);
}

function left_fill(string, fill_till, fill_with) {
    return string.padStart(fill_till, fill_with);
}


function format_timestamp(timestamp) {
    return format_date(new Date(timestamp));
}

function format_date(date) {
    return [
        left_fill(to_string(date.getUTCFullYear()), 4, '0'),
        '-',
        left_fill(to_string(date.getUTCMonth() + 1), 2, '0'),
        '-',
        left_fill(to_string(date.getUTCDate()), 2, '0'),
        ' ',
        left_fill(to_string(date.getUTCHours()), 2, '0'),
        ':',
        left_fill(to_string(date.getUTCMinutes()), 2, '0'),
        ':',
        left_fill(to_string(date.getUTCSeconds()), 2, '0'),
    ].join('')
}

/* Login State */


var ICON_TYPE_NONE = 0;
var ICON_TYPE_STATIC = 1;
var ICON_TYPE_ANIMATED = 2;

var DISCORD_CDN_ENDPOINT = 'https://cdn.discordapp.com'
var DEFAULT_AVATAR_COUNT = BigInt(5);

class User {
    constructor(data) {
        this.name = data['name'];
        this.id = BigInt(data['id']);
        this.avatar_hash = BigInt(data['avatar_hash']);
        this.avatar_type = data['avatar_type'];
        this.created_at = new Date(data['created_at']);
        this.discriminator = data['discriminator']
    }

    get_full_name() {
        return [
            this.name,
            '#',
            left_fill(to_string(this.discriminator), 4, '0')
        ].join('');
    }

    get_avatar_url_as(ext, size) {
        var icon_type = this.avatar_type;

        if (icon_type == ICON_TYPE_NONE) {
            return this.get_default_avatar_url();
        }

        var end;
        if (size === null) {
            end = '';
        } else {
            end = '?size=' + to_string(size);
        }

        var prefix, ext;
        if (ext === null) {
            if (icon_type == ICON_TYPE_STATIC) {
                prefix = '';
                ext = 'png';
            } else {
                prefix = 'a_';
                ext = 'gif';
            }
        } else {
            if (icon_type == ICON_TYPE_STATIC) {
                prefix = '';
            } else {
                prefix = 'a_';
            }
        }

        return [
            DISCORD_CDN_ENDPOINT,
            '/avatars/',
            to_string(this.id),
            '/',
            prefix,
            left_fill(to_string_base_16(this.avatar_hash), 32, '0'),
            '.',
            ext,
            end,
        ].join('');
    }

    get_default_avatar_url() {
        var default_avatar_value = this.id % DEFAULT_AVATAR_COUNT;

        return [
            DISCORD_CDN_ENDPOINT,
            '/embed/avatars/',
            to_string(default_avatar_value),
            '.png',
        ].join('');
    }
}

class LoginState {
    constructor(){
        var state_found, user, token, expires_at;

        while (1) {
            token = localStorage.getItem('token')
            if (token === null) {
                state_found = false;
                break;
            }

            var raw_user_data = localStorage.getItem('user');
            if (raw_user_data === null) {
                state_found = false;
                break;
            }

            var user_data;
            try {
                user_data = JSON.parse(raw_user_data);
            } catch {
                state_found = false;
                break;
            }

            user = new User(user_data);

            expires_at = localStorage.getItem('expires_at');
            if (expires_at === null) {
                state_found = false;
                break;
            }

            try {
                expires_at = new Date(expires_at);
            } catch {
                state_found = false;
                break;
            }

            state_found = true;
            break;
        }

        if (! state_found) {
            token = null;
            user = null;
            expires_at = null
            this.clear_locale_storage();
        }

        var is_logged_in, was_logged_in;

        if (state_found) {
            if (expires_at < (new Date())) {
                was_logged_in = true;
                is_logged_in = false;
            } else {
                was_logged_in = false;
                is_logged_in = true;
            }
        } else {
            is_logged_in = false;
            was_logged_in = false;
        }

        this.user = user;
        this.token = token;
        this.was_logged_in = was_logged_in;
        this.is_logged_in = state_found;
        this.un_authorized = false;
    }

    clear_locale_storage() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expires_at');
    }

    clear() {
        this.user = null;
        this.token = null;
        this.was_logged_in = false;
        this.is_logged_in = false;
        this.un_authorized = false;
        this.clear_locale_storage();
    }

    un_authorize() {
        LOGIN_STATE.was_logged_in = true;
        LOGIN_STATE.is_logged_in = false;
        LOGIN_STATE.un_authorized = true;
        this.clear_locale_storage();
    }
}

/* Application */

function create_header_button(system_name, to, display_name, clicked) {
    var element_attributes = {};
    var element_type;

    if (LOGIN_STATE.is_logged_in) {
        if (system_name == clicked) {
            element_attributes['className'] = 'clicked';
            element_type = 'a'
        } else {
            element_attributes['to'] = to;
            element_type = Link;
        }

    } else {
        element_attributes['className'] = 'disabled';
        element_type = 'a'
    }

    return create_element(
        element_type,
        element_attributes,
        display_name,
    );
}

function create_login_button() {
    var element;

    if (LOGIN_STATE.is_logged_in) {
        element = create_element(
            Link,
            {
                'className': 'login',
                'to': '/logoff',
            },
            create_element(
                'img',
                {'src': LOGIN_STATE.user.get_avatar_url_as(null, 32)},
            ),
            create_element(
                'p',
                null,
                LOGIN_STATE.user.get_full_name(),
            ),
        );

    } else {
        element = create_element(
            'a',
            {
                'className': 'login',
                'href': '/login'
            },
            'Login',
        );
    }

    return element;
}


function create_header(clicked) {
    return create_element(
        'nav',
        {'className': 'header'},
        create_element(
            'div',
            {'className': 'left'},
            create_header_button('profile', '/profile', 'Profile', clicked),
            create_header_button('stats', '/stats', 'Stats', clicked),
            create_header_button('notifications', '/notifications', 'Notifications', clicked),
        ),
        create_element(
            'div',
            {'className': 'right'},
            create_login_button(),
        ),
    );
}

function create_content(content_element) {
    return create_element(
        'div',
        {'className': 'content'},
        content_element,
    );
}


var WELCOME_MESSAGES = [
    'Isn\'t  it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
];

function IndexPage() {
    var content_element;

    if (LOGIN_STATE.is_logged_in || LOGIN_STATE.was_logged_in) {
        var welcome_text;
        if (LOGIN_STATE.un_authorized) {
            welcome_text = 'Something went wrong';
        } else {
            welcome_text = 'Welcome ' + LOGIN_STATE.user.name;
        }

        var notify_expired_login_element;

        if (LOGIN_STATE.is_logged_in) {
            notify_expired_login_element = choice(WELCOME_MESSAGES);
        } else {
            notify_expired_login_element = create_element(
                'a',
                {'className': 'login', 'href': '/login'},
                'Your session expired, please login',
            );
        }

        content_element = create_element(
            'div',
            {'className': 'welcome'},
            create_element(
                'div',
                {'className': 'user'},
                welcome_text,
            ),
            create_element(
                'div',
                {'className': 'message'},
                notify_expired_login_element,
            ),
        );
    } else {
        content_element = create_element(
        'div',
            {'className': 'login_reminder'},
            'Please log in first',
        );
    }

    return create_element(
        Fragment,
        null,
        create_header(null),
        create_content(content_element),
    );
}


function redirect_if_not_logged_in(component) {
    if (LOGIN_STATE.is_logged_in) {
        return create_element(
            component,
            null,
        );
    } else {
        return create_element(
            Navigate,
            {'to': '/', 'replace': true},
        );
    }
}

function ProfilePage() {
    var content_element = create_element(
        'div',
        {'className': 'profile'},
        create_element(
            'div',
            {'className': 'left'},
            create_element(
                'h1',
                null,
                LOGIN_STATE.user.name,
            ),
            create_element(
                'p',
                null,
                'id: ',
                to_string(LOGIN_STATE.user.id),
            ),
            create_element(
                'p',
                null,
                'Created at: ',
                format_date(LOGIN_STATE.user.created_at),
            ),
        ),
        create_element(
            'div',
            {'className': 'right'},
            create_element(
                'img',
                {'src': LOGIN_STATE.user.get_avatar_url_as(null, 512)},
            ),
        ),
    );

    return create_element(
        Fragment,
        null,
        create_header('profile'),
        create_content(content_element),
    )
}

function create_loader() {
    return create_element(
        'div',
        {'className': 'loader'},
    );
}


var LOADER_HOOKS = {};

class LoaderHook {
    constructor(endpoint, set_change_counter, navigator) {
        this.endpoint = endpoint;
        this.token = LOGIN_STATE.token;

        this.change_counter = 0;
        this.set_change_counter = set_change_counter;

        this.navigator = navigator;

        this.is_loaded = false;
        this.is_loading = false;

        this.data = null;
        this.data_changes = null;

        this.load();
    }

    check_reload() {
        var token = LOGIN_STATE.token;
        if (this.token == token) {
            return;
        }

        this.token = token;

        this.is_loaded = false;
        this.is_loading = false;

        this.data = null;
        this.data_changes = null;

        this.load();
        this.display()
    }

    load () {
        if (this.is_loading) {
            return;
        }

        this.is_loading = true;

        fetch(
            API_BASE_URL + this.endpoint,
            {
                'headers': {
                    'Authorization': this.token,
                },
            },
        ).then(
            (request) => this.update_from_payload(request)
        );
    }

    async update_from_payload(request) {
        var status = request.status;
        if (status == 200) {
            var data = await request.json();

            LOGIN_STATE.un_authorized = false;

            this.data = data;
            this.is_loaded = true;
            this.is_loading = false;

            this.display();
        } else {
            this.is_loading = false;

            if (status == 401) {
                LOGIN_STATE.un_authorize();
                /* `.display()` wont do anything, because it will run ur own element only, which wont redirect, */
                /* because redirect is checked one stack above it */
                this.navigator('/');
            }
        }
    }

    display() {
        /* When we call `set_change_counter` with a new value, react will reload the element */
        var change_counter = this.change_counter + 1;
        this.change_counter = change_counter;
        this.set_change_counter(change_counter);
    }
    
    change_data(field_name, field_value, default_value, display_after) {
        var data = this.data;
        var data_changes = this.data_changes;

        var value_from_data = data[field_name];

        var should_add;

        if (value_from_data === undefined) {
            if (field_value == default_value) {
                should_add = false;
            } else {
                should_add = true;
            }
        } else {
            if (value_from_data == field_value) {
                should_add = false;
            } else {
                should_add = true;
            }
        }

        if (should_add) {
            if (data_changes === null) {
                data_changes = {};
                this.data_changes = data_changes;
            }
            data_changes[field_name] = field_value;

        } else {
            if (data_changes !== null) {
                delete data_changes[field_name];

                if (Object.keys(data_changes).length == 0) {
                    this.data_changes = null;
                }
            }
        }

        if (display_after) {
            this.display();
        }
    }

    revert_changes() {
        this.data_changes = null;
        this.display();
    }

    copy_changes() {
        return {...this.data_changes}
    }

    apply_changes(changes, default_value_map, default_default_value) {
        var data = this.data;
        var old_changes = this.copy_changes();

        var field_name, field_value, default_value;

        for ([field_name, field_value] of Object.entries(changes)) {
            default_value = get_from_nullable_dict(default_value_map, field_name, default_default_value);
            if (field_value == default_value) {
                delete data[field_name];
            } else {
                data[field_name] = field_value;
            }
        }

        if (old_changes !== null) {
            for ([field_name, field_value] of Object.entries(old_changes)) {
                this.change_data(
                    field_name,
                    field_value,
                    get_from_nullable_dict(default_value_map, field_name, default_default_value),
                    false,
                );
            }
        }

        this.display();
    }

}


function get_loader_hook(endpoint) {
    var [change_counter, set_change_counter] = state_hook(0);
    var navigator = get_navigator();

    var loader_hook = LOADER_HOOKS[endpoint];
    if (loader_hook === undefined) {
        loader_hook = new LoaderHook(endpoint, set_change_counter, navigator);
        LOADER_HOOKS[endpoint] = loader_hook;
    } else {
       loader_hook.check_reload();
    }

    return loader_hook

}


function StatsPage() {
    var loader_hook = get_loader_hook('/stats');
    var content_element;

    if (loader_hook.is_loaded) {
        var data = loader_hook.data;

        content_element = create_element(
            'div',
            {'className': 'stats'},
            create_element(
                'p',
                null,
                'Hearts: ',
                to_string(data['total_love']),
            ),
            create_element(
                'p',
                null,
                'Streak: ',
                to_string(data['streak']),
            ),
        )
    } else {
        content_element = create_loader();
    }

    return create_element(
        Fragment,
        null,
        create_header('stats'),
        create_content(content_element),
    )
}


async function save_notification_settings(loader_hook, set_is_saving) {
    set_is_saving(true);
    var changes = loader_hook.copy_changes();
    var response = await fetch(
        API_BASE_URL + loader_hook.endpoint,
        {
            method: 'PATCH',
            headers: {
                'Authorization': LOGIN_STATE.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changes),
        },
    );
    set_is_saving(false);

    var response_status = response.status;
    if ((response_status >= 200) && (response_status < 400)) {
        loader_hook.apply_changes(changes, null, true);
    }
}


function change_notification_option(loader_hook, option_system_name, event) {
    loader_hook.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification(loader_hook, system_name, name) {
    var old_value = loader_hook.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = loader_hook.data_changes;
    if (data_changes === null) {
        value = old_value;
    } else {
        var new_value = data_changes[system_name];
        if (new_value === undefined) {
            value = old_value;
        } else {
            value = new_value;
        }
    }

    return create_element(
        'div',
        null,
        create_element(
            'p',
            null,
            name,
        ),
        create_element(
            'label',
            {'className': 'switch'},
            create_element(
                'input',
                {
                    'type': 'checkbox',
                    'checked': value,
                    'onChange': (event) => change_notification_option(loader_hook, system_name, event),
                },
            ),
            create_element(
                'span',
                null,
            ),
        ),
    );
}


function SaveNotificationsField({loader_hook}) {
    var [is_saving, set_is_saving] = state_hook(false);

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        save_parameters['onClick'] = () => save_notification_settings(loader_hook, set_is_saving);
        cancel_parameters['onClick'] = () => loader_hook.revert_changes();
    }

    return create_element(
        'div',
        {'className': 'save'},
        create_element(
            'div',
            {'className': 'left'},
            'Remember to save your changes',
        ),
        create_element(
            'div',
            {'className': 'right'},
            create_element(
                'a',
                save_parameters,
                'save',
            ),
            create_element(
                'a',
                cancel_parameters,
                'cancel',
            ),
        ),
    )
}


function maybe_create_notification_sync_element(loader_hook) {
    if (loader_hook.data_changes === null) {
        return '';
    }

    return create_element(
        SaveNotificationsField,
        {'loader_hook': loader_hook},
    )
}


function NotificationsPage() {
    var loader_hook = get_loader_hook('/notification_settings')
    var content_element;

    if (loader_hook.is_loaded) {
        content_element = create_element(
            'div',
            {'className': 'notifications'},
            create_element(
                'div',
                {'className': 'listing'},
                render_notification(loader_hook, 'daily', 'Daily'),
                render_notification(loader_hook, 'proposal', 'Proposal'),
            ),
            maybe_create_notification_sync_element(loader_hook),
        )
    } else {
        content_element = create_loader();
    }

    return create_element(
        Fragment,
        null,
        create_header('notifications'),
        create_content(content_element),
    )
}


function execute_logoff(navigator) {
    LOGIN_STATE.clear();
    navigator('/');
}

function cancel_logoff(navigator) {
    navigator('/');
}

function LogoffPage() {
    var navigator = get_navigator();

    if (LOGIN_STATE.was_logged_in) {
        LOGIN_STATE.clear();
        return create_element(
            Navigate,
            {'to': '/', 'replace': true},
        );
    }

    var content_element = create_element(
        'div',
        {'className': 'welcome'},
        create_element(
            'div',
            {'className': 'user'},
            'Are you sure to logoff?',
        ),
        create_element(
            'div',
            {'className': 'message'},
            create_element(
                'a',
                {
                    'className': 'left',
                    'onClick': () => execute_logoff(navigator),
                },
                'Yeah',
            ),
            create_element(
                'a',
                {
                    'className': 'right',
                    'onClick': () => cancel_logoff(navigator),
                },
                'Nah',
            ),
        )
    );

    return create_element(
        Fragment,
        null,
        create_header(null),
        create_content(content_element),
    );
}


function App() {
    return create_element(
        Router,
        null,
        create_element(
            Routes,
            null,
            create_element(
                Route,
                {
                    'path': '/',
                    'element': create_element(IndexPage, null),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/profile',
                    'element': redirect_if_not_logged_in(ProfilePage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/stats',
                    'element': redirect_if_not_logged_in(StatsPage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/notifications',
                    'element': redirect_if_not_logged_in(NotificationsPage),
                },
            ),
            create_element(
                Route,
                {
                    'path': '/logoff',
                    'element': redirect_if_not_logged_in(LogoffPage),
                },
            ),
        ),
    )
}

/* Init */

var LOGIN_STATE = new LoginState()

ReactDOM.render(
    create_element(App),
    $('app'),
);
