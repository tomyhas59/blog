import React from "react";

const PostBox = ({ children }) => {
  return (
    <section>
      <p>오늘은 내 친구들에게 어떤 일들이 일어났을까요?</p>
      <div className="post_box">{children}</div>
    </section>
  );
};

export default PostBox;
