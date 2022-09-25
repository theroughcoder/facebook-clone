import Cookies from "js-cookie";
const initialState = {
  ...Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
}

export default function  userReducer  (state = initialState, action) {
    switch(action.type){
        case "USER_LOGIN": return  action.payload
         
        default: return state
    }
}