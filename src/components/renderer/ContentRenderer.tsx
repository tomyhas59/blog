import React from "react";
import styled from "styled-components";

const ContentRenderer = ({ content }: { content: string }) => {
  if (!content) {
    return <div>No content</div>;
  }

  const lines = content.split("<br>");

  return (
    <Content>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index !== lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Content>
  );
};

export default ContentRenderer;

const Content = styled.div`
  width: 100%;
  word-break: keep-all;
`;
