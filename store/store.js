import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReactThunk from "react-redux";
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
const combineReducers = combineReducers({
  counter: counterReducer,
  user: userReducer
});
const store = createStore(
  combineReducers,
  {
    counter: counterInitalState,
    user: userInitalState
  },
  composeWithDevTools(applyMiddleware(ReactThunk))
);

export default store;
