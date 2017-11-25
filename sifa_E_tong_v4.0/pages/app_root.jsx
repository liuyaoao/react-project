// import myWebClient from 'client/my_web_client.jsx';

import React from 'react';
import FastClick from 'fastclick';
import $ from 'jquery';

import {browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.redirectIfNecessary = this.redirectIfNecessary.bind(this);

        // Fastclick
        FastClick.attach(document.body);
    }

    redirectIfNecessary(props) {
    }

    componentWillReceiveProps(newProps) {
        this.redirectIfNecessary(newProps);
    }
    componentWillMount() {
        // Redirect if Necessary
        this.redirectIfNecessary(this.props);
    }

    componentDidMount() {
    }

    render() {
        if (this.props.children == null) {
            return <div/>;
        }
        return (
            <div>{this.props.children}</div>
        );
    }
}

AppRoot.defaultProps = {
};

AppRoot.propTypes = {
    children: React.PropTypes.object
};
