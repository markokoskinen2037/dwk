import { useState } from "react"

function App() {
  const [todo, setTodo] = useState("")

  const handleInputChange = (e) => {
    const val = e.target.value
    setTodo(val.slice(0, 139))
  }

  return (
    <div className="App">
      <img style={{ height: 200 }} src="./dailyimage" alt="dailyimage" />
      <br></br>
      <input onChange={handleInputChange} value={todo}></input>
      <button>create todo</button>
      <br></br>
      <ul>
        <li>1</li>
        <li>2</li>
      </ul>
    </div>
  )
}

export default App
