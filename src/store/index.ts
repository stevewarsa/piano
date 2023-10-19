import {configureStore, createSlice} from "@reduxjs/toolkit";
import {AppState} from "../model/AppState";
import {PracticeEntry} from "../model/practice-entry";

const initialState: AppState = {
  practiceEntries: []
};
const state = createSlice({
  name: "state",
  initialState: initialState,
  reducers: {
    addPracticeEntry(state, action) {
      const practiceEntry: PracticeEntry = action.payload;
      state.practiceEntries.push(practiceEntry);
    },
    setPracticeEntries(state, action) {
      state.practiceEntries = action.payload;
    }
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
