import { combineReducers } from "redux";
import { authReducerEmployee } from "./authReducers";
import errorReducer from "./errorReducers";


export default combineReducers({
    auth: authReducerEmployee,
    errors: errorReducer
});