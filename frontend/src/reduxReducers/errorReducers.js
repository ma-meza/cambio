import { GET_ERRORS } from "../reduxActions/types";
const initialState = {};
function errorReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}
export default errorReducer;