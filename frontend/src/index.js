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
import AuthView from "./views/AuthView";
import CreateJob from "./views/CreateJob";
import CreateLocation from "./views/CreateLocation";
import JobView from "./views/JobView";
import ProfileView from "./views/ProfileView";
import FourOFour from "./views/FourOFour";

/* Import our data store */
import store, {history} from './store';

/*
  Error Logging
*/

// import Raven from 'raven-js'; import { sentry_url } from './data/config';
// if(window) {   Raven.config(sentry_url).install(); }

function requireAuth() {
  return(nextState, replace) => {
    let currentState = store.getState();
    if(!currentState.user.isLoggedIn) {
      replace({ pathname: "/auth" });
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
        <Route path="/auth" component={AuthView}></Route>
        <Route path="/createjob" component={CreateJob} onEnter={requireAuth()}></Route>
        <Route path="/createlocation" component={CreateLocation} onEnter={requireAuth()}></Route>
        <Route path="/job/:jobid" component={JobView} onEnter={requireAuth()}></Route>
        <Route path="/profile/:profileName" component={ProfileView} onEnter={requireAuth()}></Route>
      </Route>
      <Route path="*" component={FourOFour} />
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
