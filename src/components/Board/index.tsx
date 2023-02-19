import React from "react"
import { Table, TableBody, TableCell, TableRow } from "@mui/material"

import { useAppSelector } from "../../utils/hooks"
import { Cell } from "../../types"

import "./index.css"

const Board = () => {
  const board = useAppSelector((state) => state.board)

  return (
    <Table size="small">
      <TableBody>
        {board.map.map((row: Cell[], i: number) => (
          <TableRow key={i}>
            {row.map((cell: Cell, j: number) => (
              <TableCell key={j} className={cell.type}>
                {cell.type === "treasure" && `T(${cell.treasureCount})`}
                {cell?.adventurer}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default Board
