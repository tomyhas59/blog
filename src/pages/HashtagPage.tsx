import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { RootState } from "../reducer";

const HashtagPage = () => {
  const { tag } = useParams();
  const hashtagPosts = useSelector(
    (state: RootState) => state.post.hashtagPosts
  );

  console.log(hashtagPosts);

  return (
    <div>
      <h2>#{tag} 검색 결과</h2>
      {hashtagPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};

export default HashtagPage;
