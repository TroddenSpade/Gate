import * as React from 'react';
import { CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

import './App.css';
import logo from './logo.svg';


function App() {

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
        const file = new Blob([params[cols[cols.length-1].field]], {type: 'text/plain'});
        return (
          <Button
            variant="contained"
            size="small"
          >
            <a download={`${params.row[cols[0]["field"]]}.ovpn`} target="_blank" rel="noreferrer" href={URL.createObjectURL(file)} style={{
              textDecoration: "inherit",
              color: "inherit",
            }}>Download</a>
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
    <div className="App">
      <header className="App-header">
      </header>
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
  );
}

export default App;
