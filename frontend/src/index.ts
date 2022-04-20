import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {createElement as create_element} from 'react';
import {render} from 'react-dom';
import './index.css';
import {App} from './App';

render(
    create_element(
        Router,
        null,
        create_element(
            React.StrictMode,
            null,
            create_element(
                App,
                null,
            ),
        ),
    ),
    null,
);
