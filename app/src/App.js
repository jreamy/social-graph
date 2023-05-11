import './App.css';

import { useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { ForceGraph2D } from 'react-force-graph';

function App() {
  const [graphData, setGraphData] = useState({nodes: [], links: []})

  const s = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe/pub?gid=0&single=true&output=csv"

  const { readRemoteFile } = usePapaParse()
  readRemoteFile(s, {
    download: true,
    header: true,
    worker: true,
    complete: function(results) {
      const { nodes } = graphData;
      if (nodes.length) {
        return
      }

      console.log([...new Set(results.data.map((x) => x.Name))].map((x) => ({ id: x, color: 'green' })).concat(
        [...new Set(results.data.map((x) => x.Program))].map((x) => ({ id: x, color: 'blue' })),
      ))

      setGraphData({ 
        nodes: [...new Set(results.data.map((x) => x.Name))].map((x) => ({ id: x, color: 'green' })).concat(
          [...new Set(results.data.map((x) => x.Program))].map((x) => ({ id: x, color: 'blue' })),
        ),
        links: results.data.map((x) => ({ 
          source: x.Name, 
          target: x.Program,
        }))
      })
    },
  })


  return (
    <div className="App">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
      />
    </div>
  );
}

export default App;
