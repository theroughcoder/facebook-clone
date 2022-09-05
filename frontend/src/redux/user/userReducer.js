
const initialState = {
    numOfPastries: 30
}

export default function  userReducer  (state = initialState, action) {
    switch(action.type){
        case "USER_LOGIN": return {
            ...state, numOfPastries : state.numOfPastries -1
        } 
        default: return state
    }
}