import React from "react";
import styled from "styled-components";
import ContentRenderer from "./ContentRenderer";
import moment from "moment";

interface ListRendererProps {
  items: { id: number; content: string; createdAt: string; PostId: number }[];
  onItemClick: (id: number, content: string, PostId: number) => void;
}

const MyCommentListRenderer: React.FC<ListRendererProps> = ({
  items,
  onItemClick,
}) => (
  <>
    {items.length > 0 ? (
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => onItemClick(item.id, item.content, item.PostId)}
          >
            <ContentRenderer content={item.content} />
            <CreatedAt>{moment(item.createdAt).format("l")}</CreatedAt>
          </ListItem>
        ))}
      </List>
    ) : (
      <EmptyMessage>작성한 글이 없습니다.</EmptyMessage>
    )}
  </>
);

export default MyCommentListRenderer;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
  }
`;

const EmptyMessage = styled.p`
  color: #777;
  font-style: italic;
`;

const CreatedAt = styled.div`
  font-size: 0.8rem;
  color: #999;
  text-align: right;
`;
