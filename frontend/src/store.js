import {createStore, compose, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {browserHistory} from 'react-router'
import rootReducer from './reducers/index';
import thunk from "redux-thunk";
import throttle from 'lodash/throttle';

import {loadState, saveState} from "./localStorage";

/*
  Store

  Redux apps have a single store which takes
  1. All Reducers which we combined into `rootReducer`
  2. An optional starting state - similar to React's getInitialState
*/

const enhancers = compose(applyMiddleware(thunk), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f);

// Define the initial state here so that there isnt an error when referencing it
// in components
const initialState = {
    user: {
        loggedIn: false,
        loading: false,
        errors: "",
        username: "",
        token: "",
    }
};

const persistedState = loadState();

//const store = createStore(rootReducer, persistedState, enhancers);
const store = createStore(rootReducer, {...initialState, ...persistedState}, enhancers);

// we export history because we need it in `index.js` to feed into <Router>
export const history = syncHistoryWithStore(browserHistory, store);

/*
  Enable Hot Reloading for the reducers
  We re-require() the reducers whenever any new code has been written.
  Webpack will handle the rest
*/

if (module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

store.subscribe(throttle(() => {
  const state = store.getState();



  var toSave = {
    user: {
      loggedIn: state.user.loggedIn,
      loading: state.user.loading,
      errors: "",
      username: state.user.username,
      token: state.user.token,
    }
  };
  // var userAssigner = "";
  // if (typeof state.user.data.username !== "undefined") {
  //   userAssigner = state.user.data.username;
  // }
  // const stateToPersist = {
  //   user: {
  //     loading: false,
  //     isLoggedIn: state.user.isLoggedIn,
  //     error: "",
  //     data: {
  //       username: userAssigner,
  //       verified: state.user.data.verified
  //     }
  //   },
  //   jobs: {
  //     loading: false,
  //     data: state.jobs.data
  //   }
  // };
  saveState(toSave);
}, 500));

export default store;
