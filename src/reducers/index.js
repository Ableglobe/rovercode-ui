import { combineReducers } from 'redux';
import code from './code';
import console from './console';
import rover from './rover';
import sensor from './sensor';
import chatapp from './chatapp';
import chatform from './chatform'
import supporthome from './supporthome'

export default combineReducers({
  code,
  console,
  rover,
  sensor,
  chatapp,
  chatform, 
  supporthome
});
