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

export { reducer, initialState }
