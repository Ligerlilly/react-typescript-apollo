import * as React from "react"
import { ApolloQueryResult } from "apollo-client"
interface ButtonProps {
    readonly onClick: () => void | Promise<ApolloQueryResult<{}>>
    readonly text: string
}

const Button = ({onClick, text}: ButtonProps): JSX.Element => {
    return (
        <button onClick={onClick} style={styles.btn}>
            {text}
        </button>
    )
}

const styles = {
    btn: {
        marginLeft: 5,
    },
}

export default Button