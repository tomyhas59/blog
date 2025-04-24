import React from "react";
import styled from "styled-components";
import Spinner from "../ui/Spinner";

const ContentRenderer = ({ content }: { content: string }) => {
  if (!content) {
    return <Spinner />;
  }

  const regex = /@\w+/g; ///@가 붙은 문자열 찾기
  const userContent = content.replace(regex, "");

  const lines = userContent.split("<br>");

  return (
    <Content>
      {lines.map((line, index) => (
        <div key={index}>
          {line}
          {index !== lines.length - 1 && <br />}
        </div>
      ))}
    </Content>
  );
};

export default ContentRenderer;

const Content = styled.div`
  display: inline;
  width: 100%;
  word-break: keep-all;
`;
