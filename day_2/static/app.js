/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

function set_class(dictionary, class_name) {
    if (dictionary === undefined) {
        throw 'Parameter `dictionary` cannot be `undefined`';
    }

    if (class_name === undefined) {
        throw 'Parameter `class_name` cannot be `undefined`';
    }

    if (class_name === null) {
        return dictionary;
    }
    if (dictionary === null) {
        dictionary = {};
    }
    dictionary['className'] = class_name;
    return dictionary;
}


var create_element = React.createElement;
var Component = React.Component;
var Fragment = React.Fragment;


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

/* Classes */

function render_stats(data) {
    return create_element(
        Fragment,
        null,
        create_element(
            'div',
            set_class(null, 'left_300'),
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
            set_class(null, 'right_300'),
            create_element(
                'img',
                {'src': data['avatar_url']},
            ),
        ),
    );
}

class ContentChangerButtonState {
    constructor(renderer) {
        this.renderer = renderer;
        this.clicked = false;
        this.loaded = false;
        this.data = null;
    }

    set_data(data) {
        this.loaded = true;
        this.data = data;
    }

    is_clicked() {
        return self.clicked;
    }

    do_click() {
        this.clicked = true;
    }

    get_class() {
        var class_;

        if (this.clicked) {
            class_ = 'clicked';
        } else {
            class_ = null;
        }

        return class_;
    }

    get_variable_content() {
        var variable_content;

        if (this.clicked) {
            if (this.loaded) {
                variable_content = this.render();
            } else {
                variable_content = 'LOADING';
            }
        } else {
            variable_content = null;
        }

        return variable_content;
    }

    render() {
        return this.renderer(this.data);
    }

}


class VariableContentButton extends Component {
    constructor(props) {
        super(props);
        this.bind_to_parent()
        console.log(this.data_renderer);
        this.state = new ContentChangerButtonState(this.get_data_renderer());
    }

    bind_to_parent() {
        APP.register_variable_field_button(this);
    }

    update() {
        this.forceUpdate();
    }

    handle_click() {
        var state = this.state;
        if (state.is_clicked()) {
            return;
        }

        if (! state.loaded) {
            fetch(API_BASE_URL + this.get_endpoint()).then(this.update_from_payload.bind(this));
        }

        state.do_click();
        this.update();
    }

    async update_from_payload(request) {
        var data = await request.json();
        this.state.set_data(data);
        this.update();

        var variable_content = this.state.get_variable_content();
        if (variable_content !== null) {
            APP.content.set_content(variable_content);
        }
    }

    render() {
        var element_attributes = {
            onClick: this.handle_click.bind(this),
        };

        var state = this.state;

        set_class(element_attributes, state.get_class());

        return create_element(
            'a',
            element_attributes,
            this.get_title(),
        );
    }
}


class VariableContentButtonStats extends VariableContentButton {
    get_title() {
        return 'Stats';
    }
    get_endpoint() {
        return '/stats';
    }
    get_data_renderer() {
        return render_stats;
    }
}


class VariableContentState {
    constructor() {
        this.value = 'Variable content goes here';
    }
}


class VariableContent extends Component {
    constructor(props) {
        super(props);
        this.bind_to_parent()
        this.state = new VariableContentState();
    }

    bind_to_parent() {
        APP.content = this;
    }

    update() {
        this.forceUpdate();
    }

    set_content(content) {
        this.state.value = content;
        this.update();
    }

    render() {
        return create_element(
            'div',
            set_class(null, 'content'),
            this.state.value,
        )
    }

}

class App extends Component {
    constructor(props) {
        super(props);
        this.variable_field_buttons = new Set()
        this.content = null;
        APP = this;
    }

    register_variable_field_button(component) {
        this.variable_field_buttons.add(component);
    }

    render() {
        var state = this.state;

        return create_element(
            Fragment,
            null,
            create_element(
                'div',
                set_class(null, 'buttons'),
                create_element(VariableContentButtonStats),
            ),
            create_element(
                Fragment,
                null,
                create_element(VariableContent),
            ),
        );
    }
}

/* Init */

var APP;


ReactDOM.render(
    create_element(App),
    $('app'),
);
