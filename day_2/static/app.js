/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

function set_class(dictionary, class_name) {
    if (dictionary === null) {
        dictionary = {};
    }
    dictionary['className'] = class_name;
    return dictionary;
}

function with_parent(parent) {
    return {'parent': parent};
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
    return string.padStart(fill_till, fill_with)
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

class StatButtonState {
    constructor() {
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
        var data = this.data;
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
}


class StatButton extends Component {
    constructor(props) {
        super(props);
        this.bind_to_parent()
        this.state = new StatButtonState();
    }

    bind_to_parent() {
        this.props.parent.state.stat_button = this;
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
            fetch(API_BASE_URL + '/stats').then(data => this.update_from_payload(data));
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
            APP.state.content.set_content(variable_content);
        }
    }

    render() {
        var element_attributes = {
            onClick: () => this.handle_click(),
        }

        var class_ = this.state.get_class();
        if (class_ !== null) {
            element_attributes['className'] = class_;
        }

        return create_element(
            'a',
            element_attributes,
            'click',
        );
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
        this.props.parent.state.content = this;
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


class AppState {
    constructor() {
        this.stat_button = null;
        this.content = null;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = new AppState();
        APP = this;
    }

    render() {
        var state = this.state;

        return create_element(
            Fragment,
            null,
            create_element(
                'div',
                set_class(null, 'buttons'),
                create_element(StatButton, with_parent(this)),
            ),
            create_element(
                Fragment,
                null,
                create_element(VariableContent, with_parent(this)),
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
