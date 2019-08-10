import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReactThunk from "react-thunk";
// applyMiddleware 连接react和redux

const counterInitalState = {
  count: 0
};
const userInitalState = {
  count: 0
};

function counterReducer(state = counterInitalState, action) {}

function userReducer(state = userInitalState, action) {}
// 合并reducer
const combineReducersAll = combineReducers({
  counter: counterReducer,
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
        user: userInitialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );

  return store;
}
