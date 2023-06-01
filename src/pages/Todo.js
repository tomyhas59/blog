import React, { useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoTitle from "../components/TodoTitle";
import TodoList from "../components/TodoList";
import styled, { createGlobalStyle } from "styled-components";
const Todo = () => {
  const [state, setState] = useState([
    { id: 1, data: "리액트 공부하기" },
    { id: 2, data: "밥 먹기" },
  ]);

  const addList = (id, data) => {
    setState([...state, { id: id, data: data }]);
  };

  const removeList = (id) => {
    const removeData = state.filter((item) => item.id !== id);
    setState(removeData);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div>
          <TodoTitle state={state} />
          <TodoForm
            addList={addList}
            id={state.length > 0 && state[state.length - 1].id}
          />
          {state.map((v) => (
            <TodoList key={v.id} removeList={removeList} state={v} />
          ))}
        </div>
      </Wrapper>
    </>
  );
};

export default Todo;

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    background: #FDF9F3;
  }

  body, html, #root {
    height: 100%;
    font-family: -apple-system, Ubuntu , BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;;
  }
`;

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
