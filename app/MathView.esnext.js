import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer.esnext';
import Layout from './Layout.esnext';
import * as actions from './actions.esnext';

export default class SilomView {
    constructor() {

        const middleware = [thunk];
        if (true) {
            middleware.push(createLogger({
                level: 'info',
            }));
        }

        this.store = Redux.applyMiddleware(...middleware)(Redux.createStore)(reducer);
        this.store.dispatch(actions.generateInitialTasksRequested());
    }

    render(element) {
        ReactDom.render(
            this.reactComponent(actions),
            element
        );
    }

    reactComponent(actions) {
        return (<Provider store={this.store}>
        {React.createElement(Layout(actions))}
    </Provider>);
    }
}