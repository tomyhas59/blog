import React from "react";
import TodoForm from "../components/TodoForm";
import TodoTitle from "../components/TodoTitle";
import TodoList from "../components/TodoList";
import styled, { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";

const Todo = () => {
  const state = useSelector((state) => state.todo);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div>
          <TodoTitle state={state} />
          <TodoForm />
          {state.map((v) => (
            <TodoList key={v.id} state={v} />
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
