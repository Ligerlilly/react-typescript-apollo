import * as React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

interface Todo {
    readonly node: {
        readonly id: string
        readonly name: string,
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
    readonly refetch: {}
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

const withTodoListsQuery  =  graphql<Response>(allTodoLists)

const renderTodo = (t: Todo, idx: number): JSX.Element => (
    <li key={`todo-${idx}`}>{t.node.name}</li>
)

const renderTodoLists = (tl: TodoList, i: number) => (
    <div key={`blah-${i}`}>
        <div>{tl.node.name}</div>
        <ul>
            {tl.node.todos.edges.map((t: Todo, idx: number) => renderTodo(t, idx))}
        </ul>
    </div>
)

export default withTodoListsQuery(({data}) => {
    const todoLists = data && data.allTodoLists

    if (data && data.loading) {
        return <div>Loading</div>
    }
    if (data && data.error) {
        return <h1>ERROR</h1>
    }

    return (
        <div>
            <ul>
                {todoLists && todoLists.edges.map((tl: TodoList, i: number) => (
                    <li key={i}>{renderTodoLists(tl, i)}</li>
                ))
            }</ul>
        </div>
    )
})