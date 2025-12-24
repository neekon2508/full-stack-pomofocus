import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const PomoContext = createContext();

const initialState = {
  tasks: [
    // {
    //   id: 1,
    //   title: "Spring Framework Essentials",
    //   completed: 10,
    //   total: 15,
    //   isDone: false,
    // },
    // {
    //   id: 2,
    //   title: "Pro Spring",
    //   completed: 7,
    //   total: 20,
    //   isDone: false,
    // },
    // {
    //   id: 3,
    //   title: "SQL Certified Associate",
    //   completed: 0,
    //   total: 20,
    //   isDone: false,
    // },
    // {
    //   id: 4,
    //   title: "Algorithms",
    //   completed: 9,
    //   total: 50,
    //   isDone: false,
    // },
    // { id: 5, title: "Git", completed: 2, total: 10, isDone: false },
    // { id: 6, title: "React", completed: 22, total: 30, isDone: false },
    // {
    //   id: 7,
    //   title: "Pomofocus project",
    //   completed: 1,
    //   total: 20,
    //   isDone: true,
    // },
  ],
  selectedTaskId: null,
  sessions: [
    { type: "Pomodoro", duration: 1500 },
    { type: "Short Break", duration: 300 },
    { type: "Long Break", duration: 900 },
  ],
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "task/create":
      return {
        ...state,
        selectedTaskId:
          state.tasks.length === 0 ? action.payload.id : state.selectedTaskId,
        tasks: [...state.tasks, action.payload],
      };
    case "task/update":
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id === action.payload.id) {
            const updatedTask = { ...t, ...action.payload };

            return {
              ...updatedTask,
              isDone: updatedTask.completed >= updatedTask.total ? true : false,
            };
          }
          return t;
        }),
      };

    case "task/toggle":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, isDone: !t.isDone } : t
        ),
      };
    case "task/deleteAll":
      return {
        ...state,
        tasks: [],
        selectedTaskId: null,
      };
    case "task/deleteCompleted":
      const newTasks = state.tasks.filter((t) => t.isDone === false);
      return {
        ...state,
        tasks: newTasks,
        selectedTaskId: newTasks.length > 0 ? newTasks[0].id : null,
      };
    case "selectedTaskId/update":
      return { ...state, selectedTaskId: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function PomoProvider({ children }) {
  const [{ tasks, selectedTaskId, sessions, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <PomoContext.Provider
      value={{ tasks, selectedTaskId, sessions, isLoading, dispatch }}
    >
      {children}
    </PomoContext.Provider>
  );
}

function usePomos() {
  const context = useContext(PomoContext);
  if (context === undefined)
    throw new Error("PomoContext was used outside the PomoProvider");
  return context;
}
export { PomoProvider, usePomos };
