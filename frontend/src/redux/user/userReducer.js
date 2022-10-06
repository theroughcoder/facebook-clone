import Cookies from "js-cookie";


export default function  userReducer  (state = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null, action) {
    switch(action.type){
        case "USER_LOGIN": return  action.payload
        case "USER_VERIFY": return  {...state, verified: action.payload}
         
        case "USER_LOGOUT": return null 
         
        default: return state
    }
}