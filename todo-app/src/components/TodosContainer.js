import React, { Component } from 'react'
import axios from 'axios'
import update from "immutability-helper";

class TodosContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      inputValue: "",
    }
  }

  getTodos() {
    axios.get('/api/v1/todos')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTodos()
  }

  createTodo = (input) => {
    if(input.key === "Enter" && !(input.target.value === "")) {
      axios.post("/api/v1/todos", { todo: { title: input.target.value, done: false} })
      .then( (response) => {
        const todos = update(this.state.todos, {
          $splice: [[0, 0, response.data]],
        });

        this.setState( {
          todos: todos,
          inputValue: "",
        });
      })
      .catch((error) => console.log(error));
    }
  };

  handleChange = (input) => {
    this.setState( { inputValue: input.target.value });
  };

  modifyTodo = (input, id) => {
    axios.put(`/api/v1/todos/${id}`, { todo: { done: input.target.checked } })
    .then( (response) => {
      const todoIndex = this.state.todos.findIndex(
        (task) => task.id === response.data.id
      );

      const todos = update(this.state.todos, {
        [todoIndex]: { $set: response.data },
      });

      this.setState( {
        todos: todos,
      });
    })
    .catch((error) => console.log(error));
  }

  removeTodo = (id) => {
    axios.delete(`/api/v1/todos/${id}`)
    .then( () => {
      const todoIndex = this.state.todos.findIndex(
        (task) => task.id === id
      );

      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]],
      });

      this.setState({
        todos: todos,
      });
    })
    .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text" 
            placeholder="Add a task" maxLength="50"
            onKeyPress={this.createTodo}
            value={this.state.inputValue}
            onChange={this.handleChange} />
        </div>  	    
	<div className="listWrapper">
	   <ul className="taskList">
		  {this.state.todos.map((todo) => {
		    return(
		      <li className="task" todo={todo} key={todo.id}>
			<input className="taskCheckbox" type="checkbox" 
      checked={todo.done} 
      onChange={ (input) => this.modifyTodo(input, todo.id) }/>              
			<label className="taskLabel">{todo.title}</label>
			<span className="deleteTaskBtn" onClick={ () => this.removeTodo(todo.id) }>x</span>
		      </li>
		    )       
		  })} 	    
	   </ul>
	</div>
     </div>
    )
  }
}

export default TodosContainer;
