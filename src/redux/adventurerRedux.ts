import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Adventurer, Coordinates } from "../types";

interface AdventurerState {
    adventurers: Adventurer[]
}

const initialState: AdventurerState = {
    adventurers : []
}

const adventurerSlice = createSlice({
    name: "adventurer",
    initialState,
    reducers: {
        addAdventurer: (state: AdventurerState, action: PayloadAction<{name: string, pos: Coordinates, orientation: string, movements: string}>): void => {
            const {name, pos, orientation, movements} = action.payload

            state.adventurers.push({name, pos, orientation, movements, treasureCount : 0})
        },
        moveAdventurer: (state: AdventurerState, action: PayloadAction<{adventurer: Adventurer, step: Coordinates}>): void => {
            const {adventurer, step} = action.payload
            const adv = state.adventurers.find((_adventurer) => _adventurer.name === adventurer.name)

            if (adv) {
                adv.pos = step
            }
        },
        turnAdventurer: (state: AdventurerState, action: PayloadAction<{adventurer: Adventurer, newOrientation: string}>): void => {
            const {adventurer, newOrientation} = action.payload

            const adv = state.adventurers.find(_adventurer => _adventurer.name === adventurer.name)
            
            if (adv) {
                adv.orientation = newOrientation
            }
        },
        getTreasure: (state: AdventurerState, action: PayloadAction<{adventurer: Adventurer}>): void => {
            const {adventurer} = action.payload

            const adv = state.adventurers.find(_adventurer => _adventurer.name === adventurer.name)

            if (adv) {
                adv.treasureCount++
            }
        }
    }
})

export const { addAdventurer, moveAdventurer, turnAdventurer, getTreasure } = adventurerSlice.actions
export default adventurerSlice.reducer