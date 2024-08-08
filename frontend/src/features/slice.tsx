import { createSlice} from "@reduxjs/toolkit";


// 
const initialState= {
    login:false
}

export const slice = createSlice({
    name:'login',
    initialState,
    reducers:{
        login:(state)=>{
            state.login=false;
        },
        logout:(state)=>{
            state.login=true
        }
    }
})


export const {login , logout} = slice.actions;


export default slice.reducer;
