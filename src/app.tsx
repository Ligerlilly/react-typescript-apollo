import * as React from "react"
import * as Redux from "redux"
import { connect } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { history } from "./redux/store"
import PrivateRoute from "./components/private_route"
import PublicRoute from "./components/public_route"
import pageShell from "./components/page_shell"
import { AppState } from "./redux/core"
import * as actions from "./redux/actions"
import { getAccessToken } from "./util/access_token_utils"

// pages
import LoginPage from "./pages/login/login_page"
import Dashboard from "./pages/dashboard/dashboard"

interface ReduxState {
}

interface ReduxActions {
    readonly bootstrap: () => void,
}

interface AppProps {
}

const mapStateToProps = (state: AppState, ownProps: AppProps): ReduxState => ({
})

const mapDispatchToProps = (dispatch: Redux.Dispatch<AppState>): ReduxActions => ({
   bootstrap: () => dispatch( actions.bootstrap() ),
})

interface ApplicationState {

}

type ApplicationProps = ReduxState & ReduxActions & AppProps

class App extends React.Component<ApplicationProps, ApplicationState> {
    componentDidMount(): void {
        const { bootstrap } = this.props
        if (getAccessToken()) {
            bootstrap()
        }
    }

    render(): JSX.Element {
        return (
            <ConnectedRouter history={history}>
                <div>
                    <PublicRoute path="/" component={pageShell(LoginPage)}/>
                    <PrivateRoute path="/dashboard" component={pageShell(Dashboard)}/>
                </div>
            </ConnectedRouter>
        )
    }
}

const ConnectedApp: React.ComponentClass<AppProps>
    = connect(mapStateToProps, mapDispatchToProps)(App)
export default ConnectedApp
