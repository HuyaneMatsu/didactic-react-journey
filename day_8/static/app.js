/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

function set_class_name_to(class_name, into) {
    if (class_name === undefined) {
        throw 'Parameter `class_name` cannot be `undefined`';
    }

    if ((into === undefined) || (into === null)) {
        into = {};
    }

    into['className'] = class_name;
    return into;
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

    get_avatar_url_as(parameter_1, parameter_2) {
        var ext, size;

        if (parameter_1 === undefined) {
            ext = null;
            size = null;
        } else {
            if (parameter_2 === undefined) {
                if (typeof(parameter_1) == 'number') {
                    ext = null;
                    size = parameter_1;
                } else {
                    ext = parameter_1;
                    size = null;
                }

            } else {
                ext = parameter_1;
                size = parameter_2;
            }
        }

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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('expires_at');
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

    clear() {
        this.user = null;
        this.token = null;
        this.was_logged_in = false;
        this.is_logged_in = false;
        this.un_authorized = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expires_at');
    }
}


/* Application */

function render_profile(button_controller) {
    var data = button_controller.button_config.data;
    return create_element(
        'div',
        set_class_name_to('profile'),
        create_element(
            'div',
            set_class_name_to('left'),
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
            set_class_name_to('right'),
            create_element(
                'img',
                {'src': LOGIN_STATE.user.get_avatar_url_as(site=512)},
            ),
        ),
    );
}


function render_stats(button_controller) {
    var data = button_controller.button_config.data;
    return create_element(
        'div',
        set_class_name_to('stats'),
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
}

function change_notification_option(button_controller, option_system_name, event) {
    button_controller.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification(button_controller, system_name, name) {
    var old_value = button_controller.button_config.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = button_controller.button_config.data_changes;
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
            set_class_name_to('switch'),
            create_element(
                'input',
                {
                    'type': 'checkbox',
                    'checked': value,
                    'onChange': (event) => change_notification_option(button_controller, system_name, event),
                },
            ),
            create_element(
                'span',
                null,
            ),
        )
    );
}

function maybe_create_notification_sync_element(button_controller) {
    if (button_controller.button_config.data_changes === null) {
        return '';
    }

    return create_element(
        SaveNotificationsField,
        {'button_controller': button_controller},
    )
}

function render_notification_settings(button_controller) {
    return create_element(
        'div',
        set_class_name_to('notifications'),
        create_element(
            'div',
            set_class_name_to('listing'),
            render_notification(button_controller, 'daily', 'Daily'),
            render_notification(button_controller, 'proposal', 'Proposal'),
        ),
        maybe_create_notification_sync_element(button_controller),
    )
}


function render_loader() {
    return create_element(
        'div',
        set_class_name_to('loader'),
    );
}


class VariableContentButtonConfig {
    constructor(button_name, button_display_value, endpoint, renderer) {
        var is_loaded;
        if (endpoint === null ) {
            is_loaded = true;
        } else {
            is_loaded = false;
        }

        this.button_name = button_name;
        this.button_display_value = button_display_value;
        this.endpoint = endpoint;
        this.renderer = renderer;
        this.is_loading = false;
        this.is_loaded = is_loaded;
        this.data = null;
        this.data_changes = null;
    }
}

class ButtonProperties {
    constructor(set_variable_content, variable_content, clicked_button_name_reference) {
        this.set_variable_content = set_variable_content;
        this.variable_content = variable_content;
        this.clicked_button_name_reference = clicked_button_name_reference;
    }
    
    set_clicked_button(value) {
        this.clicked_button_name_reference.current = value;
    }

    get_variable_content(value) {
        return this.variable_content;
    }

    get_clicked_button(value) {
        return this.clicked_button_name_reference.current;
    }
}


var WELCOME_MESSAGES = [
    'Isn\'t  it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
];

function get_random_welcome_message() {
    return choice(WELCOME_MESSAGES);
}


function create_login_reminder() {
    return create_element(
        'div',
        set_class_name_to('login_reminder'),
        'Please log in first',
    )
}

function welcome_or_notify_expired_login() {
    var element;

    if (LOGIN_STATE.is_logged_in) {
        element = get_random_welcome_message();
    } else {
        element = create_element(
            'a',
            set_class_name_to('login', {'href': '/login'}),
            'Your session expired, please login',
        );
    }

    return element;
}

function render_default_message() {
    var element;
    if (LOGIN_STATE.is_logged_in || LOGIN_STATE.was_logged_in) {
        var welcome_text;
        if (LOGIN_STATE.un_authorized) {
            welcome_text = 'Something went wrong';
        } else {
            welcome_text = 'Welcome ' + LOGIN_STATE.user.name;
        }
        element = create_element(
            'div',
            set_class_name_to('welcome'),
            create_element(
                'div',
                set_class_name_to('user'),
                welcome_text,
            ),
            create_element(
                'div',
                set_class_name_to('message'),
                welcome_or_notify_expired_login(),
            ),
        )
    } else {
        element = create_login_reminder();
    }
    return element;
}


function app_state_hook () {
    var [variable_content, set_variable_content] = state_hook(null)
    var clicked_button_name_reference = reference_hook(null);

    if (variable_content === null) {
        variable_content = render_default_message(set_variable_content);
        set_variable_content(variable_content);
    }

    return new ButtonProperties(set_variable_content, variable_content, clicked_button_name_reference)

}

class ButtonController {
    constructor(button_config, button_properties) {
        this.button_config = button_config;
        this.button_properties = button_properties;
    }

    display() {
        this.button_properties.set_variable_content(this.button_config.renderer(this));
    }

    change_data(field_name, field_value, default_value, display_after) {
        var button_config = this.button_config;
        var data = button_config.data;
        var data_changes = button_config.data_changes;

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
                button_config.data_changes = data_changes;
            }
            data_changes[field_name] = field_value;

        } else {
            if (data_changes !== null) {
                delete data_changes[field_name];

                if (Object.keys(data_changes).length == 0) {
                    button_config.data_changes = null;
                }
            }
        }

        if (display_after) {
            this.display();
        }
    }

    revert_changes() {
        this.button_config.data_changes = null;
        this.display();
    }

    copy_changes() {
        return {...this.button_config.data_changes}
    }

    apply_changes(changes, default_value_map, default_default_value) {
        var data = this.button_config.data;
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

    render_variable_content_changer_button() {
        var element_attributes = {};

        if (LOGIN_STATE.is_logged_in) {
            var callback;
            if (this.button_config.is_loaded || this.button_config.is_loading) {
                callback = () => this.handle_other_clicks()
            } else {
                callback = () => this.handle_first_click()
            }

            var element_attributes = {
                'onClick': callback,
            }

            if (this.button_properties.get_clicked_button() == this.button_config.button_name) {
                set_class_name_to('clicked', element_attributes);
            }

        } else {
             set_class_name_to('disabled', element_attributes);
        }

        return create_element(
            'a',
            element_attributes,
            this.button_config.button_display_value,
        );
    }

    handle_first_click() {
        var button_name = this.button_config.button_name;
        this.button_properties.set_clicked_button(button_name);
        this.button_config.is_loading = true;
        this.button_properties.set_variable_content(render_loader());

        fetch(
            API_BASE_URL + this.button_config.endpoint,
            {
                'headers': {
                    'Authorization': LOGIN_STATE.token,
                },
            },
        ).then(
            (request) => this.update_from_payload(request)
        );
    }

    handle_other_clicks() {
        var button_name = this.button_config.button_name;
        this.button_properties.set_clicked_button(button_name);

        if (! this.button_config.is_loading) {
            this.display();
        }
    }

    async update_from_payload(request) {
        var status = request.status;

        if (status == 200) {
            var data = await request.json();

            LOGIN_STATE.un_authorized = false;

            var button_config = this.button_config;
            button_config.data = data;
            button_config.is_loaded = true;
            button_config.is_loading = false;

            if (this.button_properties.get_clicked_button() == button_config.button_name) {
                this.display();
            }

        } else {
            this.button_config.is_loading = false;

            if (status == 401) {
                LOGIN_STATE.was_logged_in = true;
                LOGIN_STATE.is_logged_in = false;
                LOGIN_STATE.un_authorized = true;
                this.button_properties.set_variable_content(null);
            }
        }
    }
}

var PROFILE_BUTTON_CONFIG = new VariableContentButtonConfig(
    'profile',
    'Profile',
    null,
    render_profile,
);

var CREDITS_BUTTON_CONFIG = new VariableContentButtonConfig(
    'stats',
    'Stats',
    '/stats',
    render_stats,
);

var NOTIFICATION_BUTTON_CONFIG = new VariableContentButtonConfig(
    'notification_settings',
    'Notifications',
    '/notification_settings',
    render_notification_settings,
);


function ProfileButton({button_properties}) {
    return (new ButtonController(PROFILE_BUTTON_CONFIG, button_properties)).render_variable_content_changer_button()
}

function StatsButton({button_properties}) {
    return (new ButtonController(CREDITS_BUTTON_CONFIG, button_properties)).render_variable_content_changer_button()
}

function NotificationsButton({button_properties}) {
    return (new ButtonController(NOTIFICATION_BUTTON_CONFIG, button_properties)).render_variable_content_changer_button()
}


async function save_notification_settings(button_controller, set_is_saving) {
    set_is_saving(true);
    var changes = button_controller.copy_changes();
    response = await fetch(
        API_BASE_URL + button_controller.button_config.endpoint,
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
        button_controller.apply_changes(changes, null, true);
    }
}


function SaveNotificationsField({button_controller}) {
    var [is_saving, set_is_saving] = state_hook(false);

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        set_class_name_to('save_execute_disabled', save_parameters);
        set_class_name_to('save_cancel_disabled', cancel_parameters);
    } else {
        set_class_name_to('save_execute_enabled', save_parameters);
        set_class_name_to('save_cancel_enabled', cancel_parameters);

        save_parameters['onClick'] = () => save_notification_settings(button_controller, set_is_saving);
        cancel_parameters['onClick'] = () => button_controller.revert_changes();
    }

    return create_element(
        'div',
        set_class_name_to('save'),
        create_element(
            'div',
            set_class_name_to('left'),
            'Remember to save your changes',
        ),
        create_element(
            'div',
            set_class_name_to('right'),
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


function VariableContent({variable_content}) {
    return create_element(
        'div',
        set_class_name_to('content'),
        variable_content,
    );
}

function execute_logoff(button_properties) {
    LOGIN_STATE.clear();
    button_properties.set_variable_content(null);
}

function cancel_logoff(button_properties, old_clicked_button, old_variable_content) {
    button_properties.set_clicked_button(old_clicked_button);
    button_properties.set_variable_content(old_variable_content);
}

function question_logoff(button_properties) {
    var old_clicked_button = button_properties.get_clicked_button();
    var old_variable_content = button_properties.get_variable_content();
    button_properties.set_clicked_button(null);

    var element = create_element(
        'div',
        set_class_name_to('welcome'),
        create_element(
            'div',
            set_class_name_to('user'),
            'Are you sure to logoff?',
        ),
        create_element(
            'div',
            set_class_name_to('message'),
            create_element(
                'a',
                set_class_name_to('left', {'onClick': () => execute_logoff(button_properties)}),
                'Yeah',
            ),
            create_element(
                'a',
                set_class_name_to(
                    'right',
                    {
                        'onClick': () => cancel_logoff(
                            button_properties,
                            old_clicked_button,
                            old_variable_content,
                        )
                    },
                ),
                'Nah',
            ),
        )
    );

    button_properties.set_variable_content(element);
}


function create_login_button(button_properties) {
    var element;
    if (LOGIN_STATE.is_logged_in) {
        element = create_element(
            'a',
            set_class_name_to('login', {'onClick': () => question_logoff(button_properties)}),
            create_element(
                'img',
                {'src': LOGIN_STATE.user.get_avatar_url_as(size=32)},
            ),
            create_element(
                'p',
                null,
                LOGIN_STATE.user.get_full_name(),
            )
        );
    } else {
        element = create_element(
            'a',
            set_class_name_to('login', {'href': '/login'}),
            'Login',
        );
    }
    return element;
}


function App() {
    var button_properties = app_state_hook()

    return create_element(
        Fragment,
        null,
        create_element(
            'nav',
            set_class_name_to('header'),
            create_element(
                'div',
                set_class_name_to('left'),
                create_element(
                    ProfileButton,
                    {'button_properties': button_properties},
                ),
                create_element(
                    StatsButton,
                    {'button_properties': button_properties},
                ),
                create_element(
                    NotificationsButton,
                    {'button_properties': button_properties},
                ),
            ),
            create_element(
                'div',
                set_class_name_to('right'),
                create_login_button(button_properties),
            ),
        ),
        create_element(
            Fragment,
            null,
            create_element(
                VariableContent,
                {'variable_content': button_properties.get_variable_content()},
            ),
        ),
    );
}

/* Init */

LOGIN_STATE = new LoginState()

ReactDOM.render(
    create_element(App),
    $('app'),
);
