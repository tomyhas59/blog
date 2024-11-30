import React from "react";
import styled from "styled-components";
import ContentRenderer from "./ContentRenderer";
import moment from "moment";

interface ListRendererProps {
  items: { id: number; title: string; createdAt: string }[];
  onItemClick: (title: string, id: number) => void;
}

const TitleRenderer: React.FC<ListRendererProps> = ({ items, onItemClick }) => (
  <>
    {items.length > 0 ? (
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => onItemClick(item.title, item.id)}
          >
            <ContentRenderer content={item.title} />
            <CreatedAt>{moment(item.createdAt).format("l")}</CreatedAt>
          </ListItem>
        ))}
      </List>
    ) : (
      <EmptyMessage>글이 없습니다.</EmptyMessage>
    )}
  </>
);

export default TitleRenderer;

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
    background-color: #f0f0f0;
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
