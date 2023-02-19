import React from "react"
import { Box, Divider, List, ListItem, Typography } from "@mui/material"

import { useAppSelector } from "../../utils/hooks"

const Adventurers = () => {
  const { adventurers } = useAppSelector((state) => state.adventurers)
  const { playerTurn, gameTurn } = useAppSelector((state) => state.board)

  return (
    <List sx={{ display: "flex" }}>
      {adventurers.map(
        ({ name, orientation, movements, treasureCount }, index: number) => (
          <ListItem key={index}>
            <Box>
              <Typography
                fontWeight={index === playerTurn ? "bold" : "normal"}
                color={index === playerTurn ? "primary" : "white"}
              >
                Name : {name}
              </Typography>
              <Typography>Orientation : {orientation}</Typography>
              <Typography>
                Movements : {movements.slice(0, gameTurn)}
                <u style={{ fontSize: "1.25rem" }}>
                  <strong>{movements[gameTurn]}</strong>
                </u>
                {movements.slice(gameTurn + 1)}
              </Typography>
              <Typography>Treasures : {treasureCount}</Typography>
              <Divider orientation="horizontal" />
            </Box>
          </ListItem>
        )
      )}
    </List>
  )
}

export default Adventurers
