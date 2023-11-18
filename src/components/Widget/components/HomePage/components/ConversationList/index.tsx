import React, { FC } from 'react';
import { AnyFunction } from 'src/utils/types';
const convDelete = require('../../../../../../../assets/conversation-delete.svg') as string;

import './style.scss';

interface ConversationsProps {
  conversations: any[];
  onConversationSelect: AnyFunction;
  addResponseMessage: AnyFunction | undefined;
  onConversationDelete: AnyFunction;
}

const ConversationList: FC<ConversationsProps> = ({ conversations, onConversationSelect, addResponseMessage, onConversationDelete }) => {

  return (
    <div className="conversations">
      <h2>Your existing chats appear here...</h2>
      <ul>
        {conversations.map((conversation, index) => (
      <li key={index}>
        <span onClick={() => onConversationSelect(conversation, addResponseMessage)}>
          {conversation.title}
        </span>
        <button onClick={() => onConversationDelete(conversation)}><img src={convDelete} alt={"CD"} /></button>
      </li>
    ))}
      </ul>
    </div>
  );
}

export default ConversationList;