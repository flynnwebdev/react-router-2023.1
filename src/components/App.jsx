import React, { useEffect, useReducer } from "react"
import Home from "./Home"
import CategorySelection from "./CategorySelection"
import NewEntry from "./NewEntry"
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import ShowEntry from "./ShowEntry"

// const seedEntries = [
//   { category: "Food", content: "Pizza is yummy!" },
//   { category: "Coding", content: "Coding is fun!" },
//   { category: "Gaming", content: "Skyrim is for the Nords!" },
// ]

function reducer(currentState, action) {
  switch (action.type) {
    case "setEntries":
      return {
        ...currentState,
        entries: action.entries,
      }
    case "addEntry":
      return {
        ...currentState,
        entries: [...currentState.entries, action.entry]
      }
    default:
      return currentState
  }
}

const initialState = {
  entries: [],
  categories: [],
}

const App = () => {
  const nav = useNavigate()
  // const [entries, setEntries] = useState([])

  const [store, dispatch] = useReducer(reducer, initialState)
  const { entries } = store

  useEffect(() => {
    // IIFE
    ;(async () => {
      const res = await fetch(`${import.meta.env.VITE_API_HOST}/entries`)
      const data = await res.json()
      dispatch({
        type: "setEntries",
        entries: data,
      })
    })()
  }, [])

  // HOC (higher-order component)
  function ShowEntryWrapper() {
    const { id } = useParams()
    return <ShowEntry entry={entries[id]} />
  }

  async function addEntry(category, content) {
    const id = entries.length
    // Add a new entry
    const returnedEntry = await fetch(`${import.meta.env.VITE_API_HOST}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, content }),
    })
    dispatch({
      type: "addEntry",
      entry: await returnedEntry.json(),
    })
    nav(`/entry/${id}`)
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home entries={entries} />} />
        <Route path="/category" element={<CategorySelection />} />
        <Route path="/entry">
          <Route path=":id" element={<ShowEntryWrapper />} />
          <Route path="new/:category" element={<NewEntry addEntry={addEntry} />} />
        </Route>
        <Route path="*" element={<h3>Page not found</h3>} />
      </Routes>
    </>
  )
}

export default App
