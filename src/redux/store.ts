import { combineReducers, configureStore } from "@reduxjs/toolkit"

import adventurerRedux from "./adventurerRedux"
import boardReducer from "./boardRedux"

const rootReducer = combineReducers({ board: boardReducer, adventurers: adventurerRedux })

export const store = configureStore({
    reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type
export type AppDispatch = typeof store.dispatch
