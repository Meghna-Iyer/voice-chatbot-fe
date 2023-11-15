import React, { FC } from 'react';
import { AnyFunction } from 'src/utils/types';

import './style.scss';

interface ConversationsProps {
  conversations: any[];
  onConversationSelect: AnyFunction;
  addResponseMessage: AnyFunction | undefined;
}

const ConversationList: FC<ConversationsProps> = ({ conversations, onConversationSelect, addResponseMessage }) => {

  return (
    <div className="conversations">
      <h2>Your existing chats appear here...</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <li onClick={() => onConversationSelect(conversation,addResponseMessage)}key={index}>{conversation.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationList;