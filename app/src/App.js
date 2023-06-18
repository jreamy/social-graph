import './App.css';

import { useState } from 'react';
import Graph from './Graph.js';
import SheetInput from './SheetInput.js';

import { usePapaParse } from 'react-papaparse';
import { readString } from 'react-papaparse';

// https://docs.google.com/spreadsheets/d/e/2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe/pub?gid=0&single=true&output=csv

function App() {
  const params = new URLSearchParams(window.location.search);

  const [sheet, setSheet] = useState({id: params.get("id"), gid: params.get("gid")});
  const [primary, setPrimary] = useState({id: params.get("primary"), visible: true});
  const [secondary, setSecondary] = useState({id: params.get("secondary"), visible: params.get("show-secondary") !== "false"});
  const [format, setForamt] = useState(params.get("format"))

  const [data, setData] = useState({data: [], header: []})

  const sheet_link = `https://docs.google.com/spreadsheets/d/e/${sheet.id}/pub?gid=${sheet.gid}&single=true&output=csv`;

  // Load the spreadsheet
  const { readRemoteFile } = usePapaParse();
  readRemoteFile(sheet_link, {
    download: true, header: true, worker: true,
    complete: (x) => {
      if (data.source === sheet_link && data.format === format) {
        return
      }

      if (x && !data.length) {
        if (format === "csv") {
          readString(x.data.map((x) => x[secondary.id]).join("\n"), {
            header: false, worker: true,
            complete: (y) => {
              setData({
                source: sheet_link, format: format,
                header: x.meta.fields,
                rows: x.data.map((x, idx) => y.data[idx].map((z) => ({
                  [primary.id]: x[primary.id],
                  [secondary.id]: z,
                }))).flat()
              })
            }
          })
        } else {
          setData({
            source: sheet_link, format: format,
            header: x.meta.fields,
            rows: x.data,
          });
        }
      }
    },
  })

  const update_callback = (x) => {
    if (primary.id !== x.primary) {
      setPrimary({id: x.primary, visible: true});
    }
    if (secondary.id !== x.secondary || secondary.visible !== x.show_secondary) {
      setSecondary({id: x.secondary, visible: x.show_secondary});
    }
    if (format !== x.format) {
      setForamt(x.format);
    }

    if (x.sheet.length) {
      const parts = x.sheet.match(/https:\/\/docs.google.com\/spreadsheets\/d\/e\/(.*)\/.*pub.*\?gid=(\d*).*/)
      if (parts.length !== 3) {
        console.log(parts);
        console.log("invalid sheet input");
        return
      }

      if (sheet.id !== parts[1] || sheet.gid !== parts[2]) {
        setSheet({id: parts[1], gid: parts[2]});
      }
    }
  }

  const save_callback = () => {
    if (sheet.id && sheet.gid) {
      params.set("id", sheet.id);
      params.set("gid", sheet.gid);
    }

    if (primary.id) {
      params.set("primary", primary.id);
    }

    if (secondary.id) {
      params.set("secondary", secondary.id);
      params.set("show-secondary", secondary.visible);
    }

    if (format) {
      params.set("format", format);
    }

    window.location.search = params.toString();
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', height: '100%', direction: 'ltr' }}>
      <SheetInput 
        sheet={sheet_link} header={data.header}
        primary={primary.id} format={format}
        secondary={secondary.id} show_secondary={secondary.visible}
        save={save_callback} update={update_callback}
      />
      <Graph data={data.rows} primary={primary} secondary={secondary} format={format}/>
      </div>
    </div>
  );
}

export default App;
