// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions
import axios from 'axios';

export const UPDATE_USER = 'UPDATE_USER';
export const EDIT_USER_USERNAME = 'EDIT_USER_USERNAME';
export const EDIT_USER_USERNAME_FULFILLED = `${EDIT_USER_USERNAME}_FULFILLED`;
export const EDIT_USER_USERNAME_REJECTED = `${EDIT_USER_USERNAME}_REJECTED`;
export const EDIT_USER_PASSWORD = 'EDIT_USER_PASSWORD';
export const EDIT_USER_PASSWORD_FULFILLED = `${EDIT_USER_PASSWORD}_FULFILLED`;
export const EDIT_USER_PASSWORD_REJECTED = `${EDIT_USER_PASSWORD}_REJECTED`;
export const FETCH_USER_LIST = 'FETCH_USER_LIST';
export const FETCH_USER_LIST_FULFILLED = `${FETCH_USER_LIST}_FULFILLED`;
export const FETCH_USER_LIST_REJECTED = `${FETCH_USER_LIST}_REJECTED`;

// action creators
export const updateUser = data => ({
  type: UPDATE_USER,
  payload: data,
});

export const editUserUsername = (username, xhrOptions) => ({
  type: EDIT_USER_USERNAME,
  payload: axios.put('/jwt/auth/user/', { username }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const editUserPassword = (password, xhrOptions) => ({
  type: EDIT_USER_PASSWORD,
  payload: axios.post('/jwt/auth/password/change/', {
    new_password1: password,
    new_password2: password,
  }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const fetchUserList = xhrOptions => ({
  type: FETCH_USER_LIST,
  payload: axios.get('/api/v1/users/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});
