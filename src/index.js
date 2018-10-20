import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './reducers/index';
import NotFound from './containers/Global/NotFound';
import RoverList from './containers/RoverList';
import Accounts from './containers/Accounts/Base';
import MissionControl from './containers/MissionControl';
import SupportHome from './components/SupportHome'

/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = composeEnhancers(
  applyMiddleware(
    thunk,
    createLogger(),
    promiseMiddleware(),
  ),
);

const store = createStore(rootReducer, reduxMiddleware);

// sets a reference to store @ window.store
Object.assign(window, { store });

render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <CookiesProvider>
        <Switch>
          <Route path="/accounts" component={Accounts} />
          <Route exact path="/" component={RoverList} />
          <Route exact path="/mission-control" component={MissionControl} />
          <Route exact path ="/support" component={SupportHome} />
          <Route component={NotFound} />
        </Switch>
      </CookiesProvider>
    </BrowserRouter>
  </ReduxProvider>,
  document.getElementById('app'),
);
