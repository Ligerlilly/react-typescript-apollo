# react-redux-typescript-seed
A jumping off point for building a frontend application

### Getting started

#### Helpful links if you're new to TypeScript, Redux, or React Router v4
- [TypeScript](https://github.com/Microsoft/TypeScript-React-Starter#creating-a-component)
- [Redux](http://redux.js.org/#watch-the-30-free-videos)
- [react-redux-typescript-guide](https://github.com/piotrwitek/react-redux-typescript-guide#react)
- [React Router](https://reacttraining.com/react-router/web/guides/philosophy)

#### Get project running
- cd into cloned repo
- yarn install
- yarn start
- garbage creds will log you in

#### Get login working with your backend
- on line 30 of client.ts replace "url here" with your root url
- then if you're posting your creds to the backend change login method to something like this
```js
login = (username: string, password: string): HandledResp => {
    return request.
        post(this.buildUrl("/login")).
        send({ username, password }).
        type("application/json").
        accept("application/json").
        end().
        then((res: Resp) => handleResp(res))
        .catch((res: Resp) => handleResp(res))
}
```
- then uncomment code in session_sagas .ts

#### Adding a route
- update src/app.tsx
```js
...
import YourComponent from "./pages/your_component/your_component"
...

render(): JSX.Element {
    return (
        <ConnectedRouter history={history}>
            <div>
                <PublicRoute path="/" component={pageShell(LoginPage)}/>
                <PrivateRoute path="/dashboard" component={pageShell(Dashboard)}/>
                <PrivateRoute path="/your_route" component={pageShell(YourComponent)}/>
            </div>
        </ConnectedRouter>
    )
}
```

#### Includes component library [blueprintjs](http://blueprintjs.com//docs/)
- checkout src/components/progress_spinner/progress_spinner.tsx

#### Includes [css modules](https://github.com/gajus/react-css-modules/blob/master/README.md#css-modules) and [blueprint css](http://blueprintjs.com//docs/#core/components/navbar.css-api)

```js
import * as React from "react"

const styles = require("./navbar.module.css")

interface NavbarProps {
    readonly logout: () => void,
    readonly userName: string,
}

export function Navbar(props: NavbarProps): JSX.Element {
    const { userName, logout } = props

    return(
        <nav className={`pt-navbar .modifier ${styles.nav_bar}`}>
            <div className={styles.container}>
                <div className="pt-navbar-group pt-align-right">
                    <button className={`pt-button pt-minimal ${styles.user_menu}`}>
                        <span className={styles.user_name} onClick={logout}>{userName}</span>
                        <span
                            className={`pt-icon-standard pt-icon-chevron-down ${styles.user_menu_chevron}`}
                        />
                    </button>
                </div>
            </div>
        </nav>
    )
}
```

#### Helpful VS Code workplace settings
```js
"files.exclude": {
    "node_modules/": true,
    "build/": true,
    "**/*.css": true
}
```