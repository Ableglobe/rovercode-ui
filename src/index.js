import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './reducers/index';

import NotFound from './containers/Global/NotFound';
import RoverList from './containers/RoverList';
import Accounts from './containers/Accounts/Base';

const reduxMiddleware = applyMiddleware(
  thunk,
  createLogger(),
  promiseMiddleware(),
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
          <Route component={NotFound} />
        </Switch>
      </CookiesProvider>
    </BrowserRouter>
  </ReduxProvider>,
  document.getElementById('app'),
);
