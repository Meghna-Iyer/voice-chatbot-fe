import React, { FC } from 'react';
import { AnyFunction } from 'src/utils/types';
import './style.scss';
interface FooterProps {
  onConversationSelect: AnyFunction;
}
const Footer: FC<FooterProps> = ({ onConversationSelect }) => {
  const conversation: any = {}
  conversation.isNew = true;
  conversation.title = "Hey there! How's it going?"
  return (
    <div className="footer">
      <p onClick={() => onConversationSelect(conversation, undefined)}> start your new chat...</p>
    </div>
  );
};

export default Footer;