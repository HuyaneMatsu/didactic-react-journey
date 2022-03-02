function $(element_id) {
    return document.getElementById(element_id);
}

var create_element = React.createElement;

class LikeButtonState {
    constructor() {
        this.liked = false;
    }
}


class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = new LikeButtonState();
    }
    
    handle_click() {
        this.state.liked = true;
        this.forceUpdate();
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        return create_element(
            'button',
            {
                onClick: () => this.handle_click(),
            },
            'Like',
        );
    }
}

ReactDOM.render(
    create_element(LikeButton),
    $('button'),
);
