import * as React from "react"

import { RouteComponentProps } from "react-router"

import * as redux from "redux"
import { connect } from "react-redux"
import { AppState, Session } from "../redux/core"
import TodoLists from "../components/todo_lists_v2"

interface ReduxState {
    readonly session: Session,
}

interface ReduxActions {
}

interface TodoListsProps extends RouteComponentProps<{}> {
}

const mapStateToProps = (state: AppState, ownProps: TodoListsProps): ReduxState => ({
    session: state.session,
})

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ReduxActions => ({
})

interface TodoListsState {
}

export class TodoListsV2 extends React.Component<ReduxState & ReduxActions & TodoListsProps, TodoListsState> {
    constructor(props: ReduxState & ReduxActions & TodoListsProps) {
        super(props)

        this.state = {
        }
    }

    render(): JSX.Element {
        return <TodoLists session={this.props.session} />
    }
}

const ConnectedTodoLists: React.
        ComponentClass<TodoListsProps> = connect(mapStateToProps, mapDispatchToProps)(TodoListsV2)
export default ConnectedTodoLists