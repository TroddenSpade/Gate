import * as React from 'react';
import { CircularProgress, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import './App.css';
import logo from './logo.svg';


function MainComponent() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [columns, setColumns] = React.useState([])
  const [rows, setRows] = React.useState([])
  const [status, setStatus] = React.useState(undefined)

  const get_list = async () => {
    let try_req = true
    let tries = 0
    let response = undefined

    while(try_req && tries<5){
      response = await axios.get("https://open-vpngate.onrender.com")
      .then(res => {
        try_req = false
        return res
      });
      console.log(tries + 1, " tries to fetch")
      tries++
    }

    setRows(response.data)
    if(response.data){
      let cols = []
      Object.keys(response.data[0]).forEach((value, index) => {
        if(value === "id")
          return
        cols.push({
          field: value, 
          headerName: value
        })
      })
      cols[cols.length-1]["renderCell"] = (params) => {
        const file = new Blob([atob(params.row[cols[cols.length-1].field])], {type: 'text/plain'});
        return (
          <Button
            variant="contained"
            size="small"
            download={`${params.row[cols[0]["field"]]}.ovpn`}
            target="_blank" 
            rel="noreferrer" 
            href={URL.createObjectURL(file)}
          >
            Download
          </Button>
        )
      }
      setColumns(cols)
    }
    setStatus(response.status)
  }

  React.useEffect(()=>{
    get_list()
  }, [])

  return (
    <div className="App"
    style={{
      backgroundColor: theme.palette.bg,
      color: theme.palette.color,
    }}>
      <header className="App-header">
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            p: 3,
          }}
        >
          {theme.palette.mode} mode
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </header>
      <div style={{padding: "20px"}}>
        {
          status===undefined ?
          <CircularProgress />
          :
          <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 100]}
          />
        }
      </div>
    </div>
  );
}

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function App() {
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          bg: mode === "dark" ? '#282c34' : "white",
          color: mode === "dark" ? 'white' : "black",
        },
      }),
    [mode],
  );

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MainComponent />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}