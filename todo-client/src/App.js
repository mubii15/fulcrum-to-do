import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_TODO_API}/todos`);
      setTasks(response.data);
      setError(null);  // Clear any previous error
    } catch (error) {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    const response = await axios.post(
      `${process.env.REACT_APP_TODO_API}/todos`,
      { task: newTask }
    );
    setTasks([...tasks, response.data]);
    setNewTask("");
  };

  const updateTask = async (id) => {
    if (newTask.trim() === "") return;
    const response = await axios.put(
      `${process.env.REACT_APP_TODO_API}/todos/${id}`,
      { task: newTask }
    );
    setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    setNewTask("");
    setEditingTask(null);
  };

  const deleteTask = async (id) => {
    await axios.delete(`${process.env.REACT_APP_TODO_API}/todos/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const editTask = (task) => {
    setNewTask(task.task);
    setEditingTask(task._id);
  };

  const toggleComplete = async (id, completed) => {
    const response = await axios.put(
      `${process.env.REACT_APP_TODO_API}/todos/${id}`,
      { completed: !completed }
    );
    setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="todo-container">
                <div className="header-row">
                  <h1 className="text-center">To-Do List</h1>
                </div>
                <div
                  style={{
                    height: 40,
                    width: "100%",
                    position: "absolute",
                    top: "65%",
                    background: "linear-gradient(rgba(0,0,0,0), white 30%)",
                    zIndex: 5,
                  }}
                />
                <div className="task-list custom-scrollbar">
                  {loading ? (
                    <p
                      className="text-center"
                      style={{
                        height: 500,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "rgba(33,37,41,0.45)",
                      }}
                    >
                      Loading...
                    </p>
                  ) : error ? (
                    <p
                      className="text-center"
                      style={{
                        height: 500,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "rgba(33,37,41,0.45)",
                      }}
                    >
                      {error}
                    </p>
                  ) : tasks.length === 0 ? (
                    <p
                      className="text-center"
                      style={{
                        height: 500,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "rgba(33,37,41,0.45)",
                      }}
                    >
                      Nothing to do
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div className="task-row" key={task._id}>
                        <div
                          onClick={() =>
                            toggleComplete(task._id, task.completed)
                          }
                          className={
                            task.completed ? "task-icon active" : "task-icon"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="bi bi-circle-fill"
                          >
                            <circle cx={8} cy={8} r={8} />
                          </svg>
                        </div>
                        <div
                          onClick={() =>
                            toggleComplete(task._id, task.completed)
                          }
                          className="col-8"
                        >
                          <p
                            className={
                              task.completed ? "task-text active" : "task-text"
                            }
                          >
                            {task.task}
                          </p>
                        </div>
                        <div
                          onClick={() => editTask(task)}
                          className="task-edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="task-edit"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </div>
                        <div
                          onClick={() => deleteTask(task._id)}
                          className="col-auto d-flex justify-content-center align-items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="task-delete"
                          >
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                          </svg>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="input-row">
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    type="text"
                    className="input-field"
                    placeholder="Enter Task"
                  />
                </div>
                <div className="button-row">
                  <button
                    onClick={
                      editingTask ? () => updateTask(editingTask) : addTask
                    }
                    className="btn btn-primary add-button"
                    type="button"
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default App;
