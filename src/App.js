import React from 'react';
import GameCanvas from './components/GameCanvas.js';
import Targetbar from './components/TargetBar.js';
import './App.css';

function App() {
  let state={
    phase:"game"
  }
  

  return (
    <div className="App">
      {/* <Targetbar/> */}
      <GameCanvas name={state.phase} />
      
    </div>
  );
}

export default App;
