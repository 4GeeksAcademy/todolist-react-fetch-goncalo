import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TodoList = () => {
  const [userName, setUserName] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const checkUserNameExists = async (userName) => {
    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error(resp.status + "Something Went Wrong");
      }
      const data = await resp.json();
      const userExists = data.users.some((user) => user.name === userName);
      console.log("User exists:", userExists);
      return userExists;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const createUser = async () => {
    try {
      const userExists = await checkUserNameExists(userName);
      if (!userExists) {
        console.log("User created:", userName);
        const resp = await fetch(
          `https://playground.4geeks.com/todo/users/${userName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: userName }),
          }
        );
        if (!resp.ok) {
          const data = await resp.json();
          throw new Error(data.detail);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTodoList = () => {
    if (todoList == []) {
      console.log("No tasks to fetch, todoList is empty.");
      return;
    }

    console.log("Fetch the username", userName);
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        throw Error(resp.status + "Something went wrong");
      })
      .then((userData) => {
        console.log(userData);
        setTodoList(userData.todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewTodo = () => {
    const newTodoList = { label: newTodo, is_done: false };

    if (newTodo !== "") {
      fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
        method: "POST",
        body: JSON.stringify(newTodoList),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          throw Error(resp.status + "Something went wrong in add todo");
        })
        .then(() => {
          fetchTodoList();
          setNewTodo("");
        })
        .catch((err) => {
          console.log("Something went wrong", err);
        });
    }
  };

  const deleteTask = (taskId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json;
        }
        throw Error(resp.status + "Something Went Wrong!");
      })
      .then(() => {
        fetchTodoList();
      })
      .catch((err) => {
        console.log("Something Went Wrong", err);
      });
  };

  const deleteUser = (userName) => {
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          // Check if response has content
          if (resp.status !== 204) {
            return resp.json();
          } else {
            // No content in response, handle accordingly
            return {};
          }
        } else {
          throw Error(resp.status + " Something Went Wrong");
        }
      })
      .then((data) => {
        // Handle response data
        console.log(data);
        setUserName("");
        setTodoList([]);
        console.log("user deleted");
      })
      .catch((err) => {
        console.log("Something Went Wrong", err);
      });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <h1 className="text-title">Todo List API</h1>
        </div>
        <div className="col-3"></div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <input
            className="input-field"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Please, enter your username"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                {
                  createUser();
                  fetchTodoList();
                }
              }
            }}
          />
          <button
            className="delete-button"
            onClick={() => deleteUser(userName)}
          >
            Delete User
          </button>
        </div>
        <div className="col-3"></div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <input
            className="todos-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task!"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewTodo();
              }
            }}
          />
          {todoList.map((todo, index) => {
            return (
              <div key={index} className="todo-list">
                {todo.label}
                <FontAwesomeIcon
                  className="trash-icon"
                  icon={faTrashCan}
                  onClick={() => deleteTask(todo.id)}
                />
              </div>
            );
          })}
        </div>
        <div className="col-3"></div>
      </div>
    </div>
  );
};

export default TodoList;
