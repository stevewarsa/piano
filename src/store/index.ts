import {configureStore, createSlice} from "@reduxjs/toolkit";
import {AppState} from "../model/AppState";

const initialState: AppState = {
};
const state = createSlice({
  name: "state",
  initialState: initialState,
  reducers: {
  }
});

const store = configureStore({
  reducer: state.reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});
export const stateActions = state.actions;
export default store;
