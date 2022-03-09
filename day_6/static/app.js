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
    if (dictionary === null){
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


class User {
    constructor(data) {
        this.name = data['name'];
        this.id = new BigInt(data['id']);
        this.avatar_url = data['avatar_url'];
        this.created_at = new Date(data['created_at']);
        this.discriminator = left_fill(to_string(data['discriminator']), 4, '0')
    }
}

class LoginState {
    constructor(){
        var state_found, user, token;

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
            state_found = true;
            break;
        }

        if (state_found) {
            token = null;
            user = null;
            localStorage.removeItem('token');
            localStorage.localStorage('user');
        }

        this.user = user;
        this.token = token;
        this.logged_in = state_found;
    }
}


/* Application */

function render_profile(button_controller) {
    var data = button_controller.button_config.data;
    return create_element(
        'div',
        set_class_name_to('flex'),
        create_element(
            'div',
            set_class_name_to('left_300'),
            create_element(
                'h1',
                null,
                data['name'],
            ),
            create_element(
                'p',
                null,
                'id: ',
                data['id'],
            ),
            create_element(
                'p',
                null,
                'Created at: ',
                format_timestamp(data['created_at']),
            ),
        ),
        create_element(
            'div',
            set_class_name_to('right_300'),
            create_element(
                'img',
                {'src': data['avatar_url']},
            ),
        ),
    );
}


function render_credits(button_controller) {
    var data = button_controller.button_config.data;
    return create_element(
        Fragment,
        null,
        create_element(
            'p',
            null,
            'credit: ',
            data['credit'],
        ),
        create_element(
            'p',
            null,
            'Streak: ',
            data['streak'],
        ),
    )
}

function change_notification_option(button_controller, option_system_name, event) {
    button_controller.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification_option(button_controller, system_name, name) {
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
        Fragment,
        null,
        create_element(
            'div',
            set_class_name_to('notifications'),
            render_notification_option(button_controller, 'daily', 'Daily'),
            render_notification_option(button_controller, 'proposal', 'Proposal'),
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
        this.button_name = button_name;
        this.button_display_value = button_display_value;
        this.endpoint = endpoint;
        this.renderer = renderer;
        this.is_loading = false;
        this.is_loaded = false;
        this.data = null;
        this.data_changes = null;
    }
}

class ButtonProperties {
    constructor(set_variable_content, clicked_button_name_reference) {
        this.set_variable_content = set_variable_content;
        this.clicked_button_name_reference = clicked_button_name_reference;
    }
    
    set_clicked_button(value) {
        this.clicked_button_name_reference.current = value;
    }
    
    get_clicked_button(value) {
        return this.clicked_button_name_reference.current;
    }
}


WELCOME_MESSAGES = [
    'Isn\'t  it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
]

function get_random_welcome_message() {
    return choice(WELCOME_MESSAGES);
}


function create_login_reminder() {
    return create_element(
        'div',
        set_class_name_to('login_reminder'),
        'Please log in first',
    )
)

function render_default_message() {
    var element;
    if (LOGIN_STATE.logged_in) {
        element = create_element(
            'div',
            set_class_name_to('welcome'),
            create_element(
                'div',
                set_class_name_to('user'),
                'Welcome ',
                LOGIN_STATE.user.name,
            ),
            create_element(
                'div',
                set_class_name_to('message'),
                get_random_welcome_message(),
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
        variable_content = render_default_message();
        set_variable_content(variable_content);
    }

    var button_properties = new ButtonProperties(set_variable_content, clicked_button_name_reference)

    return [button_properties, variable_content];
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
}

var PROFILE_BUTTON_CONFIG = new VariableContentButtonConfig(
    'profile',
    'Profile',
    '/profile',
    render_profile,
);

var CREDITS_BUTTON_CONFIG = new VariableContentButtonConfig(
    'credits',
    'Credits',
    '/credits',
    render_credits,
);

var NOTIFICATION_BUTTON_CONFIG = new VariableContentButtonConfig(
    'notification_settings',
    'Notifications',
    '/notification_settings',
    render_notification_settings,
);

async function update_from_payload(button_controller, request) {
    var data = await request.json();
    button_controller.button_config.data = data;
    button_controller.button_config.is_loaded = true;
    button_controller.button_config.is_loading = false;

    if (button_controller.button_properties.get_clicked_button() == button_controller.button_config.button_name) {
        button_controller.display();
    }
}

function handle_first_click(button_controller) {
    var button_name = button_controller.button_config.button_name;
    button_controller.button_properties.set_clicked_button(button_name);
    button_controller.button_config.is_loading = true;
    button_controller.button_properties.set_variable_content(render_loader());

    fetch(
        API_BASE_URL + button_controller.button_config.endpoint
    ).then(
        (request) => update_from_payload(button_controller, request)
    );
}

function handle_other_clicks(button_controller) {
    var button_name = button_controller.button_config.button_name;
    button_controller.button_properties.set_clicked_button(button_name);

    if (! button_controller.button_config.is_loading) {
        button_controller.display()
    }
}


function render_variable_content_changer_button(button_controller) {
    var callback
    if (button_controller.button_config.is_loaded || button_controller.button_config.is_loading) {
        callback = () => handle_other_clicks(button_controller)
    } else {
        callback = () => handle_first_click(button_controller)
    }

    var element_attributes = {
        'onClick': callback,
    }

    if (button_controller.button_properties.get_clicked_button() == button_controller.button_config.button_name) {
        set_class_name_to('clicked', element_attributes);
    }

    return create_element(
        'a',
        element_attributes,
        button_controller.button_config.button_display_value,
    );
}

function ProfileButton({button_properties}) {
    return render_variable_content_changer_button(new ButtonController(PROFILE_BUTTON_CONFIG, button_properties))
}

function CreditsButton({button_properties}) {
    return render_variable_content_changer_button(new ButtonController(CREDITS_BUTTON_CONFIG, button_properties))
}


function NotificationsButton({button_properties}) {
    return render_variable_content_changer_button(new ButtonController(NOTIFICATION_BUTTON_CONFIG, button_properties))
}

async function save_notification_settings(button_controller, set_is_saving) {
    set_is_saving(true);
    var changes = button_controller.copy_changes();
    response = await fetch(
        API_BASE_URL + button_controller.button_config.endpoint,
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
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

function create_login_button() {
    var element;
    if (LOGIN_STATE.logged_in) {
        element = create_element(
            'p',
            set_class_name_to('logged_in'),
            `${LOGIN_STATE.user.name}#${LOGIN_STATE.user.discriminator}`,
        );
    } else {
        element = create_element(
            'p'
            set_class_name_to('login', {'href': '/login'})
            'Login',
        );
    }
    return element;
}


function App() {
    var [button_properties, variable_content] = app_state_hook()

    return create_element(
        Fragment,
        null,
        create_element(
            'div',
            set_class_name_to('buttons'),
            create_element(
                'div',
                set_class_name_to('left'),
                create_element(
                    ProfileButton,
                    {'button_properties': button_properties},
                ),
                create_element(
                    CreditsButton,
                    {'button_properties': button_properties},
                ),
                create_element(
                    NotificationsButton,
                    {'button_properties': button_properties},
                ),
            create_element(
                'div',
                set_class_name_to('right'),
                create_login_button(),
            ),
        ),
        create_element(
            Fragment,
            null,
            create_element(
                VariableContent,
                {'variable_content': variable_content},
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
