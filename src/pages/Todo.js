import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoTitle from '../components/TodoTitle';
import TodoList from '../components/TodoList';

const Todo = () => {
  return (
    <div>
      <TodoTitle />
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default Todo;
