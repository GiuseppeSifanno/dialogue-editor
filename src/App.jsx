import { useState } from 'react'

function App() {
  const [testo, setTesto] = useState('Ciao avventuriero!')
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <p>{testo}</p>
      <input
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
      />
      <div>
        <button 
          onClick={() => setCounter(counter + 1)}>Clicca qui</button>
        <p>Hai cliccato il counter ben: {counter} volte</p>
      </div>
      <br />
      <div>
        <DialogNode nomePersonaggio="Io" testo="Ciao"/>
        <DialogNode nomePersonaggio="Gianluca" testo="Ciao, come va?"/>
      </div>
    </div>
  )
}

function DialogNode(props){
  return (
    <div className='node-card'>
      <span>
        {props.nomePersonaggio || 'NPC'}: <p>{props.testo}</p>
      </span>
    </div>
  )
}


export default App