interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default Message;
