import {combineReducers} from 'redux'
import darkModeReducer from './darkMode/darkModeReducer'
import userReducer from './user/userReducer'

export const rootReducer = combineReducers({
    user: userReducer,
    darkMode: darkModeReducer
}) 