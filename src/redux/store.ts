import { createStore, applyMiddleware } from "redux"
import createBrowserHistory from "history/createBrowserHistory"
import createHashHistory from "history/createHashHistory"
const { logger } = require(`redux-logger`)

// Use hash history for staging branches - if path begins with /branch, otherwise use browser history
const useHashHistory = window.location.pathname.match(/^\/branch\//)

import { routerMiddleware } from "react-router-redux"

import rootReducer from "./reducers/root_reducer" // Or wherever you keep your reducers
import createSagaMiddleware from "redux-saga"
import rootSaga from "./sagas"

// create saga middeware
const sagaMiddleware = createSagaMiddleware()

// Create history
export const history = useHashHistory ? createHashHistory() : createBrowserHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  rootReducer,
  applyMiddleware(middleware, sagaMiddleware, logger),
)

sagaMiddleware.run(rootSaga)