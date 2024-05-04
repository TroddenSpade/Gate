const axios = require('axios');
const express = require('express');
// const { parse } = require("csv-parse");

const PORT = process.env.PORT || 3001;

const TARGET_URL = "http://www.vpngate.net/api/iphone/"

const CSVtoJSON = csv => {
    const lines = csv.split("\r\n")

    const title = lines[0];
    const columns = lines[1].split(',');

    let result = []
    for(let i=2; i<lines.length; i++){
        let obj = {}
        let values = lines[i].split(',')
        for(let j=0; j<columns.length; j++){
            obj[columns[j]] = values[j]
        }
        result.push(obj)
    }

    return JSON.stringify(result)
}

const app = express();

app.get('/', async (req, res) => {

    let csv_str = await axios.get(TARGET_URL)
    .then((response) => { 
        return response.data
    })
    .catch((err)=> console.log(err))

    json_out = CSVtoJSON(csv_str)

    res.set('Access-Control-Allow-Origin', '*');
    res.send(json_out);
});

app.listen(PORT, () => console.log('App is listening on port ' + PORT));
