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

function render_profile(data) {
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


function render_credits(data) {
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

function create_slider_checkbox(value) {
    return create_element(
        'label',
        set_class_name_to('switch'),
        create_element(
            'input',
            {
                'type': 'checkbox',
                'defaultChecked': value,
            },
        ),
        create_element(
            'span',
            null,
        ),
    )
}

function render_notification_option(data, system_name, name) {
    var value = data[system_name];
    if (value === undefined) {
        value = false;
    }

    return create_element(
        'div',
        null,
        create_element(
            'p',
            null,
            name,
        ),
        create_slider_checkbox(value)
    );
}

function render_notification_settings(data) {
    return create_element(
        Fragment,
        null,
        render_notification_option(data, 'daily', 'Daily'),
        render_notification_option(data, 'proposal', 'Proposal'),
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

    var button_properties = new ButtonProperties(
        set_variable_content,
        clicked_button_name_reference,
    )

    return [button_properties, variable_content];
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

async function update_from_payload(
    button_config,
    button_properties,
    request,
) {
    var data = await request.json();
    button_config.data = data;
    button_config.is_loaded = true;
    button_config.is_loading = false;

    if (button_properties.get_clicked_button() == button_config.button_name) {
        button_properties.set_variable_content(button_config.renderer(data));
    }
}

function handle_first_click(
    button_config,
    button_properties,
) {
    var button_name = button_config.button_name;
    button_properties.set_clicked_button(button_name);
    button_config.is_loading = true;
    button_properties.set_variable_content(render_loader());

    fetch(
        API_BASE_URL + button_config.endpoint
    ).then(
        (request) => update_from_payload(
            button_config,
            button_properties,
            request,
        )
    );
}

function handle_other_clicks(
    button_config,
    button_properties,
) {
    var button_name = button_config.button_name;
    button_properties.set_clicked_button(button_name);

    if (! button_config.is_loading) {
        button_properties.set_variable_content(button_config.renderer(button_config.data));
    }
}


function render_variable_content_changer_button(
    button_config,
    button_properties,
) {
    var callback
    if (button_config.is_loaded || button_config.is_loading) {
        callback = () => handle_other_clicks(
            button_config,
            button_properties,
        )
    } else {
        callback = () => handle_first_click(
            button_config,
            button_properties,
        )
    }

    var element_attributes = {
        onClick: callback,
    }

    if (button_properties.get_clicked_button() == button_config.button_name) {
        set_class_name_to('clicked', element_attributes);
    }

    return create_element(
        'a',
        element_attributes,
        button_config.button_display_value,
    );
}

function ProfileButton({button_properties}) {
    return render_variable_content_changer_button(
        PROFILE_BUTTON_CONFIG,
        button_properties,
    )
}

function CreditsButton({button_properties}) {
    return render_variable_content_changer_button(
        CREDITS_BUTTON_CONFIG,
        button_properties,
    )
}


function NotificationsButton({button_properties}) {
    return render_variable_content_changer_button(
        NOTIFICATION_BUTTON_CONFIG,
        button_properties,
    )
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
