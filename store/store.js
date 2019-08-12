import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import axios from "axios";
// applyMiddleware 连接react和redux

const userInitalState = {};
const LOGOUT = "LOGOUT";

function userReducer(state = userInitalState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {};
    }
    default:
      return state;
  }
}
// 合并reducer
const combineReducersAll = combineReducers({
  user: userReducer
});

// action creators
export function logout() {
  return dispatch => {
    axios
      .post("/logout")
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT
          });
        } else {
          console.log("logout failed", resp);
        }
      })
      .catch(err => {
        console.log("logout failed", err);
      });
  };
}

export default function initializeStore(state) {
  const store = createStore(
    combineReducersAll,
    Object.assign(
      {},
      {
        user: userInitalState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );

  return store;
}
