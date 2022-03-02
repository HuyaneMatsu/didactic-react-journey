/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

var create_element = React.createElement;

/* Define globals */

var ELEMENT_VARIABLE_CONTENT = $('content');

function set_variable_content(content) {
    ELEMENT_VARIABLE_CONTENT.innerHTML = content;
}

var API_BASE_URL = document.location.origin + '/api'

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
        var element_parts = [];
        var data = this.data;

        element_parts.push('<h1>');
        element_parts.push(data['name']);
        element_parts.push('</h1>');

        return element_parts.join('');
    }
}


class StatButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = new StatButtonState();
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
    }

    render() {
        var element_attributes = {
            onClick: () => this.handle_click(),
        }

        var class_ = this.state.get_class();
        if (class_ !== null) {
            element_attributes['className'] = class_;
        }


        var variable_content = this.state.get_variable_content();
        if (variable_content !== null) {
            set_variable_content(variable_content);
        }

        return create_element(
            'a',
            element_attributes,
            'click',
        );
    }
}


/* Init */

var BUTTON_STATS = create_element(StatButton);

ReactDOM.render(
    BUTTON_STATS,
    $('stats'),
);
