import * as React from "react"

import { RouteComponentProps } from "react-router"

import * as redux from "redux"
import { connect } from "react-redux"
import { AppState, Session } from "../../redux/core"
import { setPageTitle } from "../../util/page_utils"
import { Navbar } from "../../components/navbar/navbar"
import * as actions from "../../redux/actions"
// import TLV1 from "../../components/todo_lists_v1"
import TLV2 from "../../components/todo_lists_v2"
// import TLV3 from "../../components/todo_lists_v3"
// import { genericRouteProps } from "../../util/page_utils"

const styles = require("./dashboard.module.css")

interface ReduxState {
    readonly session: Session,
}

interface ReduxActions {
    readonly logout: () => void
    readonly bootstrap: () => void
}

interface DashboardProps extends RouteComponentProps<{}> {
}

const mapStateToProps = (state: AppState, ownProps: DashboardProps): ReduxState => ({
    session: state.session,
})

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ReduxActions => ({
    logout: () => dispatch( actions.logout() ),
    bootstrap: () => dispatch( actions.bootstrap() ),
})

interface DashboardState {
}

export class Dashboard extends React.Component<ReduxState & ReduxActions & DashboardProps, DashboardState> {
    constructor(props: ReduxState & ReduxActions & DashboardProps) {
        super(props)

        this.state = {
        }
    }

    componentWillMount(): void {
        setPageTitle("Dashboard")
        this.props.bootstrap()
    }

    goToLogin = () => this.props.history.push("/")

    logout = () => {
        this.props.logout()
        this.goToLogin()
    }

    render(): JSX.Element {
        return (
            <div className={styles.dashboard}>
                <Navbar
                    logout={this.logout}
                    userName="Some User (click here to logout)"
                />
                <br />
                <br />
                <div style={{display: "flex", flexDirection: "row"}}>
                    <TLV1 />
                    <TLV2 />
                    <TLV3  {...genericRouteProps} />
                </div>
            </div>
        )
    }
}

const ConnectedApp: React.ComponentClass<DashboardProps> = connect(mapStateToProps, mapDispatchToProps)(Dashboard)
export default ConnectedApp