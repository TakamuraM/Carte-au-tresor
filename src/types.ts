export interface Board {
    map: Cell[][]
    width: number
    height: number
    gameTurn: number
    playerTurn: number
    maxTurnCount: number
    gameHasEnded: Boolean
    nbAdventurer: number
}

export interface Cell {
    type: "plain" | "mountain" | "treasure"
    treasureCount?: number
    adventurer?: string
}

export interface Coordinates {
    column: number
    row: number
}

export interface Adventurer {
    name: string
    pos: Coordinates
    orientation: string
    movements: string
    treasureCount: number
}