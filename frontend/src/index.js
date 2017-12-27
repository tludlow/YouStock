/*
  Import Dependencies
*/
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router'
import 'babel-polyfill';

/* Import CSS */
//eslint-disable-next-line
import css from './styles/main.scss';

/*
  Import Components
*/
import App from './components/App';

/*
  Import Views
*/
import Home from "./views/Home";
import FourOFour from "./views/FourOFour";
import UserAuth from "./views/UserAuth";
import NewPost from "./views/NewPost";
import PostView from "./views/PostView";
import ProfileView from "./views/ProfileView";
import AdminView from "./views/AdminView";

/* Import our data store */
import store, {history} from './store';

// function requireAuth() {
//   return(nextState, replace) => {
//     let currentState = store.getState();
//     if(!currentState.user.loggedIn) {
//       replace({ pathname: "/user" });
//     }
//   };
// }

function requireAuthAdmin() {
  return(nextState, replace) => {
    let currentState = store.getState();
    if(!currentState.user.loggedIn && !currentState.user.rank === "admin") {
      replace({ pathname: "/" });
    }
  };
}

/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/user" component={UserAuth} />
        <Route path="/newpost" component={NewPost} />
        <Route path="/post/:id" component={PostView} />
        <Route path="/profile/:id" component={ProfileView} />
        <Route path="/admin" component={AdminView} onEnter={requireAuthAdmin()} />
      </Route>
      <Route path="/*" component={FourOFour} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

/*
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={PhotoGrid} />
        <Route path="/view/:postId" component={Single}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

*/
