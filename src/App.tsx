import React from "react"
import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material"

import Board from "./components/Board"
import Reader from "./components/Reader"
import Game from "./components/Game"
import Adventurers from "./components/Adventurers"

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  })

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" className="appbar" sx={{ padding: "1rem" }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Carte au trésor
            </Typography>
          </AppBar>
          <Grid container sx={{ padding: "1rem" }}>
            <Grid item padding={0} xs={8}>
              <Board />
            </Grid>
            <Grid container item xs={4} spacing={2} padding={2}>
              <Box width="100%">
                <Box height={30}>
                  <Reader />
                </Box>
                <Box>
                  <Adventurers />
                </Box>
                <Box>
                  <Game />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default App
