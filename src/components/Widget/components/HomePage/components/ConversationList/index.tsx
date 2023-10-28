import React, { FC } from 'react';

import './style.scss';

interface ConversationsProps {
  conversations: string[];
}

const ConversationList: FC<ConversationsProps> = ({ conversations }) => {

  return (
    <div className="conversations">
      <h2>Your existing chats appear here...</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <li key={index}>{conversation}</li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationList;