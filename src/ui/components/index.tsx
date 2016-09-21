import * as React from "react";
import {connect} from 'react-redux'
import {AutoResponderBoxEntry, AutoResponderBox} from './auto-responder-box'
import {InitLoader} from './init-loader'
import AppActions from '../actions/index'
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

interface AppProps {
    onLoad: Function;
    onFileDrop: Function;
    onClientRequest: Function;
}

class App extends React.Component<AppProps, any> {
    render() {
        return <div>
            <AutoResponderBox />
            <InitLoader
                onLoad={this.props.onLoad.bind(this)}
                onFileDrop={this.props.onFileDrop.bind(this)}
                onClientRequest={this.props.onClientRequest.bind(this)}
            />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    return {
        onLoad: () => {
            dispatch(AppActions.initLoad());
        },
        onFileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry) => {
            dispatch(AppActions.fileDrop(autoResponderBoxEntry));
        },
        onClientRequest: (clientRequestEntity: ClientRequestEntity) => {
            dispatch(AppActions.clientRequest(clientRequestEntity));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);