import logo from './logo.svg';
import './App.css';

import { usePapaParse } from 'react-papaparse';

function App() {

  const s = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe/pub?gid=0&single=true&output=csv"

  const { readRemoteFile } = usePapaParse()
  readRemoteFile(s, {
    download: true,
    header: true,
    worker: true,
    complete: function(results) {
      console.log(results);
    },
  })


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
