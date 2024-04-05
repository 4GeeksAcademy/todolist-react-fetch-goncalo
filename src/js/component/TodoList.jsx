import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
  const [userName, setUserName] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("") 
  const [createUserName, setCreateUserName] = useState([]);

  const checkUserNameExists = (userName) => {
    return createUserName.includes(userName);
  };

  const createUser = () => {
    if (!checkUserNameExists(userName)) {
      setCreateUserName([...createUserName, userName]);
      console.log("User created:", userName);
      fetch (`https://playground.4geeks.com/todo/users/${userName}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }
      }).then((resp) => {
        if (resp.ok) {
          return resp.json()
        }
        throw Error(resp.status + "Something Went Wrong")
      }).then(()=>{
        fetchTodoList()
      }).catch((err) => {
        console.log("Something Went Wrong!", err)
      })
    }
  };

  const fetchTodoList = () => {
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
        console.log(userData)
        setTodoList(userData.todos);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewTodo = () => {
    
    const newTodoList ={label: newTodo, is_done: false }

    if (newTodo !== ''){
      fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
        method: 'POST',
        body: JSON.stringify(newTodoList),
        headers: {
          "Content-Type": "application/json"
        },
      }).then(resp => {
        if (resp.ok) {
          return resp.json()
        }
        throw Error(resp.status + "Something went wrong in add todo");
      }).then(() => {
        fetchTodoList()
        setNewTodo("")
      }).catch((err) => {
        console.log("Something went wrong", err);
      })
    }
  }

  const deleteTask = (taskId) => {
    fetch (`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type":"application/json"
      }
    }).then(resp => {
      if (resp.ok) {
        return resp.json
      }
      throw Error(resp.status + "Something Went Wrong!")
    }).then(()=>{
      fetchTodoList()
    }).catch((err)=>{
      console.log("Something Went Wrong", err)
    })
  }

  const deleteUser = (userName) => {
    fetch (`https://playground.4geeks.com/todo/users/${userName}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(resp => {
      if (resp.ok) {
        return resp.json()
      }
      throw Error(resp.status + " Something Went Wrong")
    }).then(() => {
        setUserName("")
    }).catch((err) => {
      console.log("Something Went Wrong", err)
    })
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
              createUser()
              fetchTodoList();
            }
          }}
        />
        <button onClick={() => deleteUser(userName)}>Delete User</button>
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
      {todoList.map((todo, index) => {
        return <div key={index}>{todo.label}<FontAwesomeIcon icon={faTrashCan} onClick={() => deleteTask(todo.id)}/></div>
      })}
    </div>
  );
};

export default TodoList;
