import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    id:''
}
const loginSlice = createSlice({
    name:'credentials',
    initialState,
    reducers:{
        addCredentials(state,action){
            state.id = action.payload
        }
    }
})

export const { addCredentials } = loginSlice.actions
export default loginSlice.reducer