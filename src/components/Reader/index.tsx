import React from "react"

import { useAppDispatch } from "../../utils/hooks"
import {
  placeAdventurer,
  addMountain,
  addTreasure,
  initBoard,
  setMaxTurn,
} from "../../redux/boardRedux"
import { addAdventurer } from "../../redux/adventurerRedux"

const Reader = () => {
  const dispatch = useAppDispatch()

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const reader = new FileReader()

    reader.onload = () => {
      const lines = reader?.result?.toString().split("\n")

      lines?.forEach((line) => {
        const parts = line.split(" - ")

        switch (parts[0]) {
          case "#":
            break
          case "C":
            if (parts.length < 3) {
              break
            }
            // TODO: vérifier qu'il s'agit bien de number
            dispatch(
              initBoard({
                width: parseInt(parts[1]),
                height: parseInt(parts[2]),
              })
            )
            break
          case "M":
            if (parts.length < 3) {
              break
            }
            // TODO: vérifier qu'il s'agit bien de number
            dispatch(
              addMountain({
                pos: { row: parseInt(parts[2]), column: parseInt(parts[1]) },
              })
            )
            break
          case "T":
            if (parts.length < 4) {
              break
            }
            // TODO: vérifier qu'il s'agit bien de number
            dispatch(
              addTreasure({
                pos: { row: parseInt(parts[2]), column: parseInt(parts[1]) },
                count: parseInt(parts[3]),
              })
            )
            break
          default:
            if (parts.length < 6) {
              break
            }
            dispatch(
              placeAdventurer({
                pos: { row: parseInt(parts[3]), column: parseInt(parts[2]) },
                adventurer: parts[1][0],
              })
            )
            dispatch(setMaxTurn({ turns: parts[5].length }))
            dispatch(
              addAdventurer({
                name: parts[1],
                pos: { row: parseInt(parts[3]), column: parseInt(parts[2]) },
                orientation: parts[4],
                movements: parts[5],
              })
            )
            break
        }
      })
    }
    reader.readAsText(file)
  }
  return <input type="file" onChange={handleFileRead} />
}

export default Reader
