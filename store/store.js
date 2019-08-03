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

// next文件编译后会存在.next文件中， node每次都会从此文件中读取，
// 每次编译时，store都会创建一次，之后就不会再创建了，我们需要每次编译时都要让它重新创建
export default function initalStore(state) {
  const store = createStore(
    combineReducers,
    Object.assign(
      {},
      {
        counter: counterInitalState,
        user: userInitalState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReactThunk))
  );
  return store;
}
