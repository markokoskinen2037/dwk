import { useEffect, useState } from "react"

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

function App() {
  const [todo, setTodo] = useState("")
  const [todoList, setTodoList] = useState([])

  useEffect(() => {
    async function getTodos() {
      const todos = await fetch("/todos").then((r) => r.json())
      setTodoList(todos)
    }
    getTodos()
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setTodo(val.slice(0, 139))
  }

  const addTodo = async () => {
    try {
      const newlist = await postData("/todos", {
        description: todo,
        done: false,
      })
      setTodoList(newlist)
      setTodo("")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="App">
      <img style={{ height: 200 }} src="./dailyimage" alt="dailyimage" />
      <br></br>
      <input onChange={handleInputChange} value={todo}></input>
      <button onClick={addTodo}>create todo</button>
      <br></br>
      <ul>
        {todoList.map(({ description, done }) => (
          <li key={description}>
            {description} - {done ? "done" : "not done"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
