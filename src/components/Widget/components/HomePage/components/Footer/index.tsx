import React, { FC } from 'react';
import { AnyFunction } from 'src/utils/types';
import './style.scss';
interface FooterProps {
  onConversationSelect: AnyFunction;
}
const Footer: FC<FooterProps> = ({ onConversationSelect }) => {
  const conversation: any = {}
  conversation.isNew = true;
  conversation.title = "Welcome to Friday's World 🌐💬"
  return (
    <div className="footer">
      <p onClick={() => onConversationSelect(conversation, undefined)}> Fresh chat, let's dive in! 🚀💬</p>
    </div>
  );
};

export default Footer;