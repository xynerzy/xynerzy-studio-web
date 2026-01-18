type MemberItem = {
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
  type MemberItem,
  type MessageItem
};