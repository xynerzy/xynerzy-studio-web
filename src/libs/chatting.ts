/**
 * @File        : chatting.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2026-01-30
 * @Description : Chatting Entity Model
 * @Site        : https://github.com/xynerzy
 **/

type ChatSessionItem = {
  name: string,
  intro: string,
  members: Array<string> | [],
  updated: string,
  active?: boolean,
  online?: boolean,
  unread?: number,
};

type MessageItem = {
  type: string,
  userId: string,
  avatar?: string,
  content: string,
  time: string,
  unread?: number
};

export {
  type ChatSessionItem,
  type MessageItem
};