import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {render} from 'react-dom';
import './index.css';
import {App} from './App';

render(
    (
        <Router>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </Router>
    ),
    document.getElementById('root'),
);
