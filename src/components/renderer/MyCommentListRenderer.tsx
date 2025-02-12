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

export const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

export const ListItem = styled.li`
  align-items: center;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  font-size: 0.7rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    color: white;
  }
`;

export const EmptyMessage = styled.p`
  color: #777;
  font-style: italic;
`;

export const CreatedAt = styled.div`
  font-size: 0.6rem;
  color: #999;
  text-align: right;
`;
