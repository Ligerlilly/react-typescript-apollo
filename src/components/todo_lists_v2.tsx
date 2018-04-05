import * as React from "react"
import { graphql, compose, ChildProps } from "react-apollo"
import gql from "graphql-tag"
import { ApolloQueryResult } from "apollo-client"
import Button from "./button"

interface Todo {
    readonly node: {
      readonly id: string
      readonly name: string
      readonly todoListId: number
    }
  }

interface TodoList {
    readonly node: {
        readonly id: string
        readonly name: string
        readonly todos: {
            readonly edges: ReadonlyArray<Todo>,
        },
    }
}

interface Response {
    readonly allTodoLists: {
        readonly edges: ReadonlyArray<TodoList>,
    }

    readonly loading: boolean
    readonly error: {}
    readonly refetch: () => Promise<ApolloQueryResult<{}>>
}

const allTodoLists = gql`query {
    allTodoLists {
        edges {
            node {
                id
                name
                todos {
                    edges {
                        node {
                            id
                            name
                            todoListId
                        }
                    }
                }
            }
        }
    }
}`

const addTodoListMutation = gql`
    mutation addTodoList($name: String!) {
        createTodoList(name: $name) { todoList { id } }
    }
`

const addTodoItemMutation = gql`
   mutation addTodoItem($todoListId: Int!, $name: String!) {
       createTodoItem(todoListId: $todoListId, name: $name) { todoItem {id } }
   }
`

const renameTodoListMutation = gql`
    mutation updateTodoList($id: Int, $name: String!) {
        updateTodoList(id: $id, name: $name) { todoList { name } }
    }
`

const renameTodoItemMutation = gql`
    mutation updateTodoItem($id: Int, $name: String!) {
        updateTodoItem(id: $id, name: $name) { todoItem { name } }
    }
`

const deleteTodoItemMutation = gql`
    mutation deleteTodoItem($id: Int!) {
        deleteTodoItem(id: $id) { todoItem { id } }
    }
`

const deleteTodoListMutation = gql`
    mutation deleteTodoList($id: Int!) {
        deleteTodoList(id: $id) { todoList { id } }
    }
`

interface InputProps {
    readonly addTodoList: (input: NewListVars) => Promise<Response>
    readonly addTodo: (input: NewTodoVars) => Promise<Response>
    readonly renameTodoList: (input: EditVars) => Promise<Response>
    readonly renameTodo: (input: EditVars) => Promise<Response>
    readonly deleteTodoList: (input: DeleteVars) => Promise<Response>
    readonly deleteTodo: (input: DeleteVars) => Promise<Response>
}

interface NewListVars {
    readonly variables: {
        readonly name: string,
    }
}
interface NewTodoVars {
    readonly variables: {
        readonly todoListId: number
        readonly name: string
    }
}

interface EditVars {
    readonly variables: {
        readonly id: number,
        readonly name: string
    }
}

interface DeleteVars {
    readonly variables: {
        readonly id: number,
    }
}

type A = {readonly a: number}
type B = {readonly b: number}

const withTodoQueries = compose(
    graphql<{}>(deleteTodoItemMutation, { name: "deleteTodo" }),
    graphql<{}>(deleteTodoListMutation, { name: "deleteTodoList" }),
    graphql<{}>(renameTodoItemMutation, {name: "renameTodo"}),
    graphql<{}>(renameTodoListMutation, { name: "renameTodoList" }),
    graphql<{}>(addTodoItemMutation, { name: "addTodo" }),
    graphql<{}>(addTodoListMutation, { name: "addTodoList" }),
    graphql<Response, InputProps>(allTodoLists, {}),
)

interface TodoListsState {
    readonly toBeChanged: string
    readonly changeValue: string
}

class TodoLists extends React.Component<ChildProps<InputProps, Response>, TodoListsState> {
    constructor(props: ChildProps<InputProps, Response> ) {
        super(props)
        this.renderTodoLists = this.renderTodoLists.bind(this)
        this.submitTodoList = this.submitTodoList.bind(this)
        this.renderTodoListInput = this.renderTodoListInput.bind(this)
        this.clearChange = this.clearChange.bind(this)
        this.submitTodo = this.submitTodo.bind(this)
        this.state = {
            toBeChanged: "",
            changeValue: "",
        }
    }

    onChange(text: string): void {
        this.setState({changeValue: text})
    }

    clearChange(): void {
        this.setState({toBeChanged: "", changeValue: ""})
    }

    submitTodo(): void {
        const { toBeChanged, changeValue } = this.state
        if (changeValue === "") {
            this.clearChange()
            return
        }

        if (toBeChanged.includes("-") && toBeChanged.split("-")[0] === "newTodo") {
            const todoListId: number = parseInt(toBeChanged.split("-")[1], 10)
            const newTodo: NewTodoVars = {variables: {todoListId, name: changeValue}}
            this.props.addTodo(newTodo).then(this.props.data && this.props.data.refetch)
        }

        const id = toBeChanged.split("-")[1]
        this.props.renameTodo({
            variables: {
                id: parseInt(id, 10),
                name: changeValue,
            }
        }).then(this.props.data && this.props.data.refetch)
        this.clearChange()
    }

    submitTodoList(): void {
        const { data, addTodoList, renameTodoList } = this.props
        const { toBeChanged, changeValue } = this.state
        if (changeValue === "") {
            this.clearChange()
            return
        }

        if (toBeChanged === "newList") {
            const newList: NewListVars = {variables: {name: changeValue}}
            addTodoList(newList).then(data && data.refetch)
            this.clearChange()
            return
        }

        const todoListId = toBeChanged.split("-")[1]
        const editListVars: EditVars = {
            variables: {
                id: parseInt(todoListId, 10),
                name: changeValue,
            }
        }

        renameTodoList(editListVars).then(data && data.refetch)
        this.clearChange()
    }

    renderTodoInput(): JSX.Element {
        const { changeValue } = this.state
        return (
            <div style={{flexDirection: "row"}}>
                <input
                    type="text"
                    autoFocus={true}
                    value={changeValue}
                    onChange={
                        (e: React.FormEvent<HTMLInputElement>) => {
                            return this.onChange(e.currentTarget.value)
                    }}
                />
                <Button
                    onClick={this.submitTodo}
                    text="save"
                />
                <Button
                    onClick={this.clearChange}
                    text="cancel"
                />
            </div>
        )
    }

    renderTodoListInput(): JSX.Element {
        const { changeValue } = this.state
        return (
            <div style={{flexDirection: "row"}}>
                <input
                    type="text"
                    autoFocus={true}
                    value={changeValue}
                    onChange={
                        (e: React.FormEvent<HTMLInputElement>) => {
                            return this.onChange(e.currentTarget.value)
                    }}
                />
                <Button
                    onClick={this.submitTodoList}
                    text="save"
                />
                <Button
                    onClick={this.clearChange}
                    text="cancel"
                />
            </div>
        )
    }

    renderTodo(t: Todo, i: number): JSX.Element | undefined {
        if (t.node.name === "") {
            return
        }

        const todoId = parseInt(atob(t.node.id).split(":")[1], 10)
        const todoListId = t.node.todoListId

        return (
            <li key={`todo-${i}`}>
                {t.node.name}
                <Button
                    onClick={() => this.setState({
                        toBeChanged: `todo-${todoId}-${todoListId}`,
                        changeValue: t.node.name
                    })}
                    text="Edit"
                />

                <Button
                    onClick={() => this.props.deleteTodo({variables: {id: todoId}})
                    .then(this.props.data && this.props.data.refetch)}
                    text="Delete"
                />
            </li>
        )
    }

    renderTodoList(tl: TodoList): JSX.Element {
        const { toBeChanged } = this.state
        const todoListId = parseInt(atob(tl.node.id).split(":")[1], 10)

        return (
            <div>
                {tl.node.name}
                <Button
                    onClick={() => this.setState({toBeChanged: `newTodo-${todoListId}`})}
                    text="Add todo"
                />
                <Button
                    onClick={() => this.setState({
                        toBeChanged: `todoList-${todoListId}`,
                        changeValue: tl.node.name,
                    })}
                    text="Edit list"
                />
                <Button
                    onClick={() => this.props.deleteTodoList({variables: {id: todoListId}})
                        .then(this.props.data && this.props.data.refetch)}
                    text="Delete list"
                />
                {(toBeChanged.split("-")[0] === "newTodo" &&
                    toBeChanged.split("-")[1] === todoListId.toString()) &&
                    this.renderTodoInput()}
                <ul>
                    {tl.node.todos.edges.map((t: Todo, idx: number) => {
                        return `todo-${parseInt(atob(t.node.id).split(":")[1], 10)}-${todoListId}` === toBeChanged ?
                        this.renderTodoInput() :
                        this.renderTodo(t, idx)
                    })}
                </ul>
            </div>
        )
    }

    renderTodoLists(tl: TodoList, i: number): JSX.Element {
        const { toBeChanged } = this.state
        const todoListId = parseInt(atob(tl.node.id).split(":")[1], 10)

        return (
            <div key={`todo-list-${i}`}>
                {toBeChanged === `todoList-${todoListId}` ? this.renderTodoListInput() : this.renderTodoList(tl)}
            </div>
        )
    }

    render(): JSX.Element {
        const { toBeChanged } = this.state
        const { data } = this.props
        const todoLists = data && data.allTodoLists

        if (data && data.loading) {
            return <div>Loading</div>
        }
        if (data && data.error) {
            return <h1>ERROR</h1>
        }

        return (
            <div>
                {toBeChanged === "newList" ?
                    this.renderTodoListInput() : (
                        <Button
                            onClick={() => this.setState({toBeChanged: "newList"})}
                            text="Add new list"
                        />
                    )
                }
                <ul>
                    {todoLists && todoLists.edges.map((tl: TodoList, i: number) => (
                        <div key={`list-${i}`}>
                            <li >{this.renderTodoLists(tl, i)}</li>
                        </div>
                    ))}
                </ul>
            </div>
        )
    }
}

export default withTodoQueries(TodoLists)