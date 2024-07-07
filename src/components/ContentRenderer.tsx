import React from "react";

const ContentRenderer = ({ content }: { content: string }) => {
  const lines = content.split("<br>").map((line, index) => {
    return (
      <React.Fragment key={index}>
        {line}
        {index !== content.split("<br>").length - 1 && <br />}
      </React.Fragment>
    );
  });

  return <>{lines}</>;
};

export default ContentRenderer;
