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


function render_loader() {
    return create_element(
        'div',
        set_class_name_to('loader'),
    );
}

async function update_from_payload(
    clicked_reference,
    button_name,
    set_is_loaded,
    set_is_loading,
    set_data,
    renderer,
    set_variable_content,
    request,
) {
    var data = await request.json();
    set_data(data);
    set_is_loaded(true);
    set_is_loading(false);

    if (clicked_reference.current == button_name) {
        set_variable_content(renderer(data));
    }
}

function handle_first_click(
    set_clicked_button,
    clicked_reference,
    button_name,
    set_is_loaded,
    set_is_loading,
    data,
    set_data,
    endpoint,
    renderer,
    set_variable_content,
) {
    set_clicked_button(button_name);
    set_is_loading(true);
    set_variable_content(render_loader());
    clicked_reference.current = button_name;

    fetch(
        API_BASE_URL + endpoint
    ).then(
        (request) => update_from_payload(
            clicked_reference,
            button_name,
            set_is_loaded,
            set_is_loading,
            set_data,
            renderer,
            set_variable_content,
            request,
        )
    );
}

function handle_other_clicks(
    set_clicked_button,
    clicked_reference,
    button_name,
    is_loading,
    data,
    renderer,
    set_variable_content,
) {
    set_clicked_button(button_name);
    clicked_reference.current = button_name;

    if (! is_loading) {
        set_variable_content(renderer(data));
    }
}


function render_variable_content_changer_button(
    clicked_button,
    set_clicked_button,
    clicked_reference,
    button_name,
    button_display_value,
    is_loaded,
    set_is_loaded,
    is_loading,
    set_is_loading,
    data,
    set_data,
    endpoint,
    renderer,
    set_variable_content,
) {
    var callback
    if (is_loaded || is_loading) {
        callback = () => handle_other_clicks(
            set_clicked_button,
            clicked_reference,
            button_name,
            is_loading,
            data,
            renderer,
            set_variable_content,
        )
    } else {
        callback = () => handle_first_click(
            set_clicked_button,
            clicked_reference,
            button_name,
            set_is_loaded,
            set_is_loading,
            data,
            set_data,
            endpoint,
            renderer,
            set_variable_content,
        )
    }

    var element_attributes = {
        onClick: callback,
    }

    if (clicked_button == button_name) {
        set_class_name_to('clicked', element_attributes);
    }

    return create_element(
        'a',
        element_attributes,
        button_display_value,
    );
}

function ProfileButton({clicked_button, set_clicked_button, set_variable_content, clicked_reference}) {
    var [is_loaded, set_is_loaded] = state_hook(false);
    var [is_loading, set_is_loading] = state_hook(false);
    var [data, set_data] = state_hook(null);

    return render_variable_content_changer_button(
        clicked_button,
        set_clicked_button,
        clicked_reference,
        'profile',
        'Profile',
        is_loaded,
        set_is_loaded,
        is_loading,
        set_is_loading,
        data,
        set_data,
        '/profile',
        render_profile,
        set_variable_content,
    )
}

function CreditsButton({clicked_button, set_clicked_button, set_variable_content, clicked_reference}) {
    var [is_loaded, set_is_loaded] = state_hook(false);
    var [is_loading, set_is_loading] = state_hook(false);
    var [data, set_data] = state_hook(null);

    return render_variable_content_changer_button(
        clicked_button,
        set_clicked_button,
        clicked_reference,
        'credits',
        'Credits',
        is_loaded,
        set_is_loaded,
        is_loading,
        set_is_loading,
        data,
        set_data,
        '/credits',
        render_credits,
        set_variable_content,
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
    var [variable_content, set_variable_content] = state_hook('Variable content goes here')
    var [clicked_button, set_clicked_button] = state_hook(null);
    var clicked_reference = reference_hook(null);

    return create_element(
        Fragment,
        null,
        create_element(
            'div',
            set_class_name_to('buttons'),
            create_element(
                ProfileButton,
                {
                    'clicked_button': clicked_button,
                    'set_clicked_button': set_clicked_button,
                    'set_variable_content': set_variable_content,
                    'clicked_reference': clicked_reference,
                },
            ),
            create_element(
                CreditsButton,
                {
                    'clicked_button': clicked_button,
                    'set_clicked_button': set_clicked_button,
                    'set_variable_content': set_variable_content,
                    'clicked_reference': clicked_reference,
                },
            ),
        ),
        create_element(
            Fragment,
            null,
            create_element(
                VariableContent,
                {
                    'variable_content': variable_content,
                },
            ),
        ),
    );
}

/* Init */

ReactDOM.render(
    create_element(App),
    $('app'),
);
