/* Define base functionality */

function $(element_id) {
    return document.getElementById(element_id);
}

var create_element = React.createElement;


/* Define globals */

var ELEMENT_VARIABLE_CONTENT = $('content');

function set_variable_content(content) {
console.log('setting content');
console.log(content);
    ELEMENT_VARIABLE_CONTENT.innerHTML = content;
}

var CONTENT_STATE_NONE = 0;
var CONTENT_STATE_CLICKED = 1;


/* Classes */

class StatButtonState {
    constructor() {
        this.state = CONTENT_STATE_NONE;
    }

    get_class() {
        var class_;
        var state = this.state;

        if (state == CONTENT_STATE_NONE) {
            class_ = null;

        } else if (state == CONTENT_STATE_CLICKED) {
            class_ = 'clicked';

        } else {
            class_ = null;
        }

        return class_
    }

    get_variable_content() {
        var variable_content;
        var state = this.state;

        if (state == CONTENT_STATE_NONE) {
            variable_content = null;

        } else if (state == CONTENT_STATE_CLICKED) {
            variable_content = 'clicked';

        } else {
            variable_content = null;
        }

        return variable_content;
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
        if (state.state == CONTENT_STATE_CLICKED) {
            return;
        }

        state.state = CONTENT_STATE_CLICKED;
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
