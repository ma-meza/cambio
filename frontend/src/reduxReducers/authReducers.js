import {
    SET_CURRENT_USER,
    USER_LOADING
} from "../reduxActions/types";
const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

const initialEmployeeState = {
    isEmployeeAuthenticated: false,
    employee: {},
    loading: false
};

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}

export function authReducerEmployee(state = initialEmployeeState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isEmployeeAuthenticated: !isEmpty(action.payload),
                employee: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}