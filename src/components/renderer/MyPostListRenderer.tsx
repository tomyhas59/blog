import React from "react";
import styled from "styled-components";
import ContentRenderer from "./ContentRenderer";
import moment from "moment";
import { NotificationType } from "../../types";
import {
  List,
  ListItem,
  CreatedAt,
  EmptyMessage,
} from "./MyCommentListRenderer";

interface ListRendererProps {
  items: {
    id: number;
    title: string;
    createdAt: string;
    Notifications: NotificationType[];
  }[];
  onItemClick: (title: string, id: number) => void;
}

const MyPostListRenderer: React.FC<ListRendererProps> = ({
  items,
  onItemClick,
}) => {
  return items.length ? (
    <List>
      {items.map((item) => {
        const notRead = item.Notifications?.some(
          (notification) => notification.isRead === false
        );
        return (
          <ListItem
            key={item.id}
            onClick={() => onItemClick(item.title, item.id)}
          >
            <ContentRenderer content={item.title} />
            {notRead && (
              <NotificationMessage>새로운 댓글이 있습니다</NotificationMessage>
            )}
            <CreatedAt>{moment(item.createdAt).format("l")}</CreatedAt>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <EmptyMessage>글이 없습니다.</EmptyMessage>
  );
};

export default MyPostListRenderer;

const NotificationMessage = styled.div`
  font-size: 10px;
  color: red;
`;
