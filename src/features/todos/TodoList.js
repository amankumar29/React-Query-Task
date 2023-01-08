import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todoApi"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons"
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import './style.css'

const TodoList = () => {
    const [newTodo, setNewTodo] = useState('')
    const queryClient = useQueryClient()

    const {
        isLoading,
        isError,
        error,
        data: todos
    } = useQuery(['todos'], getTodos, {
        select: data => data.sort((a, b) => b.id - a.id)
    })

    const addTodoMutation = useMutation(addTodo, {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("todos")
        }
    })

    const updateTodoMutation = useMutation(updateTodo, {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("todos")
        }
    })

    const deleteTodoMutation = useMutation(deleteTodo, {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("todos")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false })
        setNewTodo('')
    }

    const newItemSection = (
        <form onSubmit={handleSubmit}>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter New Task"
                />
            </div>
            <button className="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>
    )

    let content
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isError) {
        content = <p>{error.message}</p>
    } else {
        content = todos.map((todo) => {
            return (
                <article className="flex justify-between" key={todo.id}>
                    <div className="flex hello">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            id={todo.id}
                            onChange={() =>
                                updateTodoMutation.mutate({ ...todo, completed: !todo.completed })
                            }
                        />
                        <div>
                        <div >{todo.title}</div>
                        
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-20 mr-2 flex justify-center font-semibold text-sm ${todo.completed? 'text-green-600':'text-red-600'}`}>{todo.completed ? 'Done':"To Do"}</div>
                    <button className="trash" onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    </div>
                </article>
            )
        })
    }

    return (
        <main className="mt-10">
            <div className="flex items-center justify-center text-4xl font-extrabold text-orange-600">Todo Task</div>
            {newItemSection}
            {content}
        </main>
    )
}
export default TodoList