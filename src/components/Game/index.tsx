import React, { useCallback, useEffect, useRef, useState } from "react"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"

import { Adventurer, Coordinates } from "../../types"
import { useAppDispatch, useAppSelector } from "../../utils/hooks"
import {
  getTreasure,
  moveAdventurer,
  turnAdventurer,
} from "../../redux/adventurerRedux"
import { nextTurn, updateBoard } from "../../redux/boardRedux"

const Game = () => {
  const { map, width, height, gameTurn, playerTurn, gameHasEnded } =
    useAppSelector((state) => state.board)
  const { adventurers } = useAppSelector((state) => state.adventurers)
  const dispatch = useAppDispatch()

  const [isPlaying, setIsPlaying] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom of the log box whenever new logs are added
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [logs])

  /**
   * Sets player next orientation depending on current orientation
   * @param currentOrientation player current orientation
   * @param direction choosed direction
   * @returns new orientation
   */
  const setOrientation = (
    currentOrientation: string,
    direction: "G" | "D"
  ): string => {
    switch (currentOrientation) {
      case "N":
        return direction === "G" ? "W" : "E"
      case "E":
        return direction === "G" ? "N" : "S"
      case "S":
        return direction === "G" ? "E" : "W"
      case "W":
        return direction === "G" ? "S" : "N"
      default:
        return currentOrientation
    }
  }

  /**
   * Checks if next step is a valid movement or not
   * @param step nex step
   * @returns if movement is valid or not
   */
  const isMovementValid = useCallback(
    (step: Coordinates): Boolean => {
      const { row, column } = step

      if (row > height - 1 || row < 0) {
        return false
      } else if (column > width - 1 || column < 0) {
        return false
      } else if (map[row][column].type === "mountain") {
        return false
      } else if (map[row][column].adventurer) {
        return false
      }

      return true
    },
    [height, map, width]
  )

  /**
   * Checks if player will step into a treasure
   * @param step next movement
   * @returns if there is a treasure or not
   */
  const isOnTreasure = useCallback(
    (step: Coordinates): Boolean => {
      const { row, column } = step

      if (map[row][column].type === "treasure") {
        return map[row][column].treasureCount! > 0
      }

      return false
    },
    [map]
  )

  /**
   * Makes the player state move and update the new board
   * @param player current player
   * @param step next movement
   */
  const performMove = useCallback(
    (player: Adventurer, step: Coordinates) => {
      const onTreasure = isOnTreasure(step)

      if (onTreasure) {
        dispatch(getTreasure({ adventurer: player }))
        setLogs((prev) => [...prev, `${player.name} r??cup??re un tr??sor`])
      }
      dispatch(moveAdventurer({ adventurer: player, step }))
      dispatch(updateBoard({ adventurer: player, step, onTreasure }))
    },
    [dispatch, isOnTreasure]
  )

  /**
   * Determines which step the player will do according to its orientation
   * @param player current player
   */
  const setNextMovement = useCallback(
    (player: Adventurer): void => {
      let message = ""
      let step: Coordinates = { row: 0, column: 0 }

      switch (player.orientation) {
        case "N":
          step = { row: player.pos.row - 1, column: player.pos.column }
          if (!isMovementValid(step)) {
            message = `${player.name} ne peut pas s'avancer vers le haut`
          } else {
            message = `${player.name} s'est avanc?? vers le haut\n`
          }
          break
        case "E":
          step = { row: player.pos.row, column: player.pos.column + 1 }
          if (!isMovementValid(step)) {
            message = `${player.name} ne peut pas s'avancer vers la droite`
          } else {
            message = `${player.name} s'est avanc?? vers la droite\n`
          }
          break
        case "S":
          step = { row: player.pos.row + 1, column: player.pos.column }
          if (!isMovementValid(step)) {
            message = `${player.name} ne peut pas s'avancer vers le bas`
          } else {
            message = `${player.name} s'est avanc?? vers le bas\n`
          }
          break
        case "W":
          step = { row: player.pos.row, column: player.pos.column - 1 }
          if (!isMovementValid(step)) {
            message = `${player.name} ne peut pas s'avancer vers la gauche`
          } else {
            message = `${player.name} s'est avanc?? vers la gauche\n`
          }
          break
      }

      if (isMovementValid(step)) {
        performMove(player, step)
      }

      if (message !== "") {
        setLogs((prev) => [...prev, message])
      }
    },
    [isMovementValid, performMove]
  )

  /**
   * Determines which action the player has to do (move/orientation)
   * @param currentPlayer player whose turn it is
   */
  const parseMovement = useCallback(
    (currentPlayer: Adventurer): void => {
      const { movements } = currentPlayer
      let message = ""
      let newOrientation = ""

      if (!movements[gameTurn]) return

      switch (movements[gameTurn]) {
        case "D":
          newOrientation = setOrientation(currentPlayer.orientation, "D")
          dispatch(
            turnAdventurer({ adventurer: currentPlayer, newOrientation })
          )
          message = `${currentPlayer.name} s'oriente sur sa droite`
          break
        case "G":
          newOrientation = setOrientation(currentPlayer.orientation, "G")
          dispatch(
            turnAdventurer({ adventurer: currentPlayer, newOrientation })
          )
          message = `${currentPlayer.name} s'oriente sur sa gauche`
          break
        case "A":
          setNextMovement(currentPlayer)
          break
        default:
          message = `${currentPlayer.name} tente un mouvement non autoris??`
          break
      }

      if (message !== "") {
        setLogs((prev) => [...prev, message])
      }
    },
    [dispatch, gameTurn, setNextMovement]
  )

  /**
   * Game player
   */
  const play = useCallback(() => {
    const currentPlayer = adventurers[playerTurn]

    parseMovement(currentPlayer)
    dispatch(nextTurn())
  }, [adventurers, dispatch, parseMovement, playerTurn])

  // Start or stop the game based on the isPlaying state
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPlaying && !gameHasEnded) {
      intervalId = setInterval(() => {
        play()
      }, 100)
    }

    return () => clearInterval(intervalId)
  }, [isPlaying, gameHasEnded, play])

  /**
   * Generates output file
   */
  const getOutputFile = () => {
    const carte = "C - " + width + " - " + height + "\n"

    const mountains = []
    const treasures = []

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (map[i][j].type === "mountain") {
          mountains.push(`M - ${j} - ${i}`)
        } else if (map[i][j].type === "treasure") {
          treasures.push(`T - ${j} - ${i} - ${map[i][j].treasureCount}`)
        }
      }
    }

    const advs = adventurers.map(
      (adventurer) =>
        "A - " +
        adventurer.name +
        " - " +
        adventurer.pos.column +
        " - " +
        adventurer.pos.row +
        " - " +
        adventurer.orientation +
        " - " +
        adventurer.treasureCount
    )

    const data =
      carte +
      mountains.join("\n") +
      "\n" +
      treasures.join("\n") +
      "\n" +
      advs.join("\n")
    const file = new File([data], "result", {
      type: "text/plain",
      lastModified: Date.now(),
    })

    const a = document.createElement("a")
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
  }

  return (
    <Grid
      container
      maxHeight="70vh"
      overflow="hidden"
      spacing={1}
      padding={2}
      border="1px solid rgba(255, 255, 255, 0.2)"
    >
      <Grid item xs={12}>
        <Stack spacing={2} direction="row">
          <Button
            disabled={
              adventurers.length === 0 || gameHasEnded.valueOf() || isPlaying
            }
            onClick={play}
            variant="contained"
            size="small"
          >
            Step by step
          </Button>
          <Button
            disabled={
              adventurers.length === 0 || gameHasEnded.valueOf() || isPlaying
            }
            onClick={() => setIsPlaying(!isPlaying)}
            variant="contained"
            size="small"
          >
            Auto play
          </Button>
          <Button
            disabled={!gameHasEnded.valueOf()}
            onClick={getOutputFile}
            variant="contained"
            size="small"
          >
            Output file
          </Button>
        </Stack>
      </Grid>
      {logs.length ? (
        <Box
          maxHeight="70vh"
          width="100%"
          marginTop={1}
          padding={1}
          sx={{ overflowY: "auto", overflowX: "hidden" }}
          ref={boxRef}
        >
          {logs.map((log: string, index: number) => (
            <Typography gutterBottom key={index}>
              {log}
            </Typography>
          ))}
        </Box>
      ) : null}
    </Grid>
  )
}
export default Game
