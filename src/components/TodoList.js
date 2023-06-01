import React from "react";
import { Button } from "./TodoForm";
import styled from "styled-components";
const TodoList = () => {
  const data = [
    { id: 1, data: "리액트 공부하기" },
    { id: 2, data: "밥 먹기" },
  ];

  return (
    <div>
      {data.map((d) => (
        <div>
          <Span>
            {d.id}. {d.data}
          </Span>
          <Button>완료</Button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

const Span = styled.div`
  display: inline-block;
  border-radius: 5px;
  width: 500px;
  height: 40px;
  border: 1px solid;
  padding-left: 20px;
  position: relative;
  line-height: 40px;
`;
