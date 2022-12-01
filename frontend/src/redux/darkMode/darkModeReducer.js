import Cookies from "js-cookie";


export default function  darkModeReducer  (state = Cookies.get('darkMode') ? JSON.parse(Cookies.get('darkMode')) : null, action) {
    switch(action.type){
        case "DARK_MODE_ON": return  action.payload
        case "DARK_MODE_OFF": return  action.payload
         
      
         
        default: return state
    }
}