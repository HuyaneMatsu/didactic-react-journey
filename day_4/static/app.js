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
    button_controller.change_data(option_system_name, event.target.checked, false)
}

function render_notification_option(button_controller, system_name, name) {
    var old_value = button_controller.button_config.data[system_name];
    if (old_value === undefined) {
        old_value = false;
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
                    'defaultChecked': value,
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

function render_notification_settings(button_controller) {
    return create_element(
        Fragment,
        null,
        render_notification_option(button_controller, 'daily', 'Daily'),
        render_notification_option(button_controller, 'proposal', 'Proposal'),
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

function app_state_hook () {
    var [variable_content, set_variable_content] = state_hook('Variable content goes here')
    var clicked_button_name_reference = reference_hook(null);

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

    change_data(field_name, field_value, default_value) {
        var button_config = this.button_config;
        var data = button_config.data;
        var data_changes = button_config.data_changes;

        var value_from_data = data[field_name];

        var should_add;

        if (value_from_data === undefined) {
            should_add = true;
        } else if (value_from_data == field_value) {
            if (field_value == default_value) {
                should_add = false;
            } else {
                should_add = true;
            }
        } else {
            should_add = true;
        }

        if (should_add) {
            if (data_changes === null) {
                data_changes = {};
                button_config.data_changes = data_changes;
            }
            data_changes[field_name] = field_value;

        } else {
            if (data_changes !== null) {
                delete data_changes[field_value];

                if (Object.keys(data_changes).length == 0) {
                    button_config.data_changes = null;
                }
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
        onClick: callback,
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


function VariableContent({variable_content}) {
    return create_element(
        'div',
        set_class_name_to('content'),
        variable_content,
    )
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

ReactDOM.render(
    create_element(App),
    $('app'),
);
