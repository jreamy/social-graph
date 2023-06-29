import './App.css';

import { useState } from 'react';
import { Buffer } from "buffer"; 
import { usePapaParse } from 'react-papaparse';

import Graph from './Graph.js';
import SheetInput from './SheetInput.js';

// https://docs.google.com/spreadsheets/d/e/2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe/pub?gid=0&single=true&output=csv

function App() {
  const params = new URLSearchParams(window.location.search);

  var nodes_init = []
  try {
    if (params.get("nodes")) {
      nodes_init = JSON.parse(Buffer.from(params.get("nodes"), "base64").toString())
    }
  } catch (e) {
    console.log("failed to parse json for nodes")
  }

  var links_init = []
  try {
    if (params.get("links")) {
      links_init = JSON.parse(Buffer.from(params.get("links"), "base64").toString())
    }
  } catch (e) {
    console.log("failed to parse json for links")
  }

  const [sheet, setSheet] = useState({id: params.get("id"), gid: params.get("gid")});

  const [nodes, setNodes] = useState(nodes_init)
  const [links, setLinks] = useState(links_init)
  const [data, setData] = useState({data: [], header: []})

  const sheet_link = `https://docs.google.com/spreadsheets/d/e/${sheet.id}/pub?gid=${sheet.gid}&single=true&output=csv`;

  // Load the spreadsheet
  const { readRemoteFile } = usePapaParse();
  readRemoteFile(sheet_link, {
    download: true, header: true, worker: true,
    complete: (x) => {
      if (data.source === sheet_link) {
        return
      }

      if (x && !data.length) {
        setData({
          source: sheet_link,
          header: x.meta.fields,
          rows: x.data,
        });
      }
    },
  })

  const update_callback = (x) => {
    setNodes([...x.nodes])
    setLinks([...x.links].map((x) => JSON.parse(x)))

    if (x.sheet.length) {
      const parts = x.sheet.match(/https:\/\/docs.google.com\/spreadsheets\/d\/e\/(.*)\/.*pub.*\?gid=(\d*).*/)
      if (!parts || parts.length !== 3) {
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

    if (nodes) {
      params.set("nodes", Buffer.from(JSON.stringify(nodes)).toString("base64"))
    }

    if (links) {
      params.set("links", Buffer.from(JSON.stringify(links)).toString("base64"))
    }

    window.location.search = params.toString();
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', height: '100%', direction: 'ltr' }}>
      <SheetInput 
        sheet={sheet_link} header={data.header} nodes={nodes} links={links}
        save={save_callback} update={update_callback}
      />
      <Graph data={data.rows} nodes={nodes} links={links}/>
      </div>
    </div>
  );
}

export default App;
