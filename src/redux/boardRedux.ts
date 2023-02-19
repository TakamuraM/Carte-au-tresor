import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Adventurer, Board, Coordinates } from "../types";

const initialState: Board = {
    map: [],
    width: 0,
    height: 0,
    gameTurn: 0,
    playerTurn: 0,
    maxTurnCount: 0,
    gameHasEnded: false,
    nbAdventurer: 0
}

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        initBoard: (state: Board, action: PayloadAction<{width: number, height: number}>): void => {
            const {width, height} = action.payload
            for (let i = 0; i < height; i++) {
                state.map[i] = []
                for (let j = 0; j < width; j++) {
                  state.map[i][j] = {type : "plain"}
                }
            }
            state.width = width
            state.height = height
        },
        addMountain: (state: Board, action: PayloadAction<{pos: Coordinates}>): void => {
            const {row, column} = action.payload.pos
            if (row >= state.width || column >= state.height) {
                return
            }

            state.map[row][column].type = "mountain"
        },
        addTreasure: (state: Board, action: PayloadAction<{pos: Coordinates, count: number}>): void => {
            const {pos, count} = action.payload
            const {row, column} = pos
            if (row >= state.height || column >= state.width) {
                return
            }

            state.map[row][column].type = "treasure"
            state.map[row][column].treasureCount = count
        },
        placeAdventurer: (state: Board, action: PayloadAction<{pos: Coordinates, adventurer: string}>): void => {
            const {pos, adventurer} = action.payload
            const {row, column} = pos
            if (row >= state.height || column >= state.width) {
                return
            }

            state.map[row][column].adventurer = adventurer
            state.nbAdventurer++
        },
        setMaxTurn: (state: Board, action: PayloadAction<{turns: number}>): void => {
            const {turns} = action.payload
            state.maxTurnCount = turns > state.maxTurnCount ? turns : state.maxTurnCount 
        },
        nextTurn: (state: Board): void => {
            state.playerTurn++

            if (state.playerTurn === state.nbAdventurer) {
                state.gameTurn++
                state.playerTurn = 0
            }

            state.gameHasEnded = state.gameTurn === state.maxTurnCount 
        },
        updateBoard: (state: Board, action: PayloadAction<{adventurer: Adventurer, step: Coordinates, onTreasure?: Boolean}>): void => {
            const {adventurer, step, onTreasure} = action.payload
            state.map[adventurer.pos.row][adventurer.pos.column].adventurer = undefined
            state.map[step.row][step.column].adventurer = adventurer.name[0]

            if (onTreasure) {
                state.map[step.row][step.column].treasureCount!--

                if (state.map[step.row][step.column].treasureCount === 0) {
                    state.map[step.row][step.column].type = "plain"
                }
            }
        }
    }
})

export const { initBoard, addMountain, addTreasure, placeAdventurer, setMaxTurn, nextTurn, updateBoard } = boardSlice.actions
export default boardSlice.reducer