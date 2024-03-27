import React, { useState } from "react";

const TodoList = () => {
  const [userName, setUserName] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("") 

  const fetchTodoList = () => {
    console.log("Fetch the username", userName);

    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${userName}`, {
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
      .then((todoData) => {
        setTodoList(todoData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewTodo = () => {
    const newTodoList =[...todoList, {done: false, label: newTodo}]

    if (newTodo !== ''){
      fetch(`https://playground.4geeks.com/apis/fake/todos/user/${userName}`, {
        method: 'PUT',
        body: JSON.stringify(newTodoList),
        headers: {
          "Content-Type": "application/json"
        },
      }).then(resp => {
        if (resp.ok) {
          return resp.json()
        }
        throw Error(resp.status + "Something went wrong");
      }).then((newTodoData) => {
        fetchTodoList()
        setNewTodo("")
      }).catch((err) => {
        console.log("Something went wrong", err);
      })
    }
  }

  return (
    <div>
      <div>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Please, enter your username"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTodoList();
            }
          }}
        />
        <button>Delete User</button>
      </div>
      <input 
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        placeholder="Enter a new task!"
        onKeyDown={e => {
          if(e.key === 'Enter'){
            addNewTodo()
          }
        }}
      />
      <ul>
        {todoList.map(todo => {
          return <li key={todo.id}>{todo.label}</li>;
        })}
      </ul>
    </div>
  );
};

export default TodoList;
