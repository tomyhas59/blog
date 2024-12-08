import React from "react";
import styled from "styled-components";
import ContentRenderer from "./ContentRenderer";
import moment from "moment";
import { Notification } from "../../types";

interface ListRendererProps {
  items: {
    id: number;
    title: string;
    createdAt: string;
    Notifications: Notification[];
  }[];
  onItemClick: (title: string, id: number) => void;
}

const MyPostListRenderer: React.FC<ListRendererProps> = ({
  items,
  onItemClick,
}) => {
  return (
    <>
      {items.length > 0 ? (
        <List>
          {items.map((item) => {
            const notRead = item.Notifications.some(
              (noti) => noti.isRead === false
            );
            return (
              <ListItem
                key={item.id}
                onClick={() => onItemClick(item.title, item.id)}
              >
                <ContentRenderer content={item.title} />
                {notRead && (
                  <NotificationMessage>
                    새로운 댓글이 있습니다
                  </NotificationMessage>
                )}
                <CreatedAt>{moment(item.createdAt).format("l")}</CreatedAt>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <EmptyMessage>글이 없습니다.</EmptyMessage>
      )}
    </>
  );
};

export default MyPostListRenderer;

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

const NotificationMessage = styled.div`
  font-size: 10px;
  color: red;
`;
