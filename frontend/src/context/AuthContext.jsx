/* @author: Jagraj Kaur
   @FileDescription: To implement the context API which is a built-in feature of React helps to share data (state),
    across the component tree without passing the props down through each level of tree manually. It's a state management
    tool helps to manage global or shared state in application.
*/
import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
    user: localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
};

export const authContext = createContext(initialState);

const authReducer = (state,action)=>{
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                role: null,
                token:null,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                role: action.payload.role,
                token:action.payload.token,
            };
        case "LOGOUT":
            return {
                user: null,
                role: null,
                token:null,
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(authReducer, initialState);
   
    /* to store the user details in local storage so that after page refresh user stays logged in */
    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
        localStorage.setItem('role', state.role);
    }, [state]);
    
    return (
        <authContext.Provider 
            value={{
                user: state.user, 
                token: state.token, 
                role: state.role, 
                dispatch,
            }}
        >
            {children}
        </authContext.Provider>
    );
};