import { useRef, useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import cn from 'classnames';

import Header from './components/Header';
import Messages from './components/Messages';
import Sender from './components/Sender';
import QuickButtons from './components/QuickButtons';

import { AnyFunction } from '../../../../utils/types';

import './style.scss';
import ConversationList from './components/ConversationList';
import Footer from './components/Footer';

interface ISenderRef {
  onSelectEmoji: (event: any) => void;
}

type Props = {
  title: string;
  subtitle: string;
  senderPlaceHolder: string;
  showCloseButton: boolean;
  disabledInput: boolean;
  autofocus: boolean;
  className: string;
  sendMessage: AnyFunction;
  toggleChat: AnyFunction;
  profileAvatar?: string;
  profileClientAvatar?: string;
  titleAvatar?: string;
  onQuickButtonClicked?: AnyFunction;
  onTextInputChange?: (event: any) => void;
  sendButtonAlt: string;
  showTimeStamp: boolean;
  resizable?: boolean;
  emojis?: boolean;
};

function HomePage({
  title,
  subtitle,
  showCloseButton,
  className,
  toggleChat,
  titleAvatar,
  resizable,
}: Props) {
  const [containerDiv, setContainerDiv] = useState<HTMLElement | null>();
  let startX, startWidth;

  useEffect(() => {
    const containerDiv = document.getElementById('rcw-conversation-container');
    setContainerDiv(containerDiv);
  }, []);

  const initResize = (e) => {
    if (resizable) {
      startX = e.clientX;
      if (document.defaultView && containerDiv){
        startWidth = parseInt(document.defaultView.getComputedStyle(containerDiv).width);
        window.addEventListener('mousemove', resize, false);
        window.addEventListener('mouseup', stopResize, false);
      }
    }
  }

  const resize = (e) => {
    if (containerDiv) {
      containerDiv.style.width = (startWidth - e.clientX + startX) + 'px';
    }
  }

  const stopResize = (e) => {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
  }

  const conversations = ['Conversation 1', 'Conversation 2', 'Conversation 3', 'Conversation 4', 'Conversation 5', 'Conversation 6', 'Conversation 7'];

  return (
    <div id="rcw-conversation-container" onMouseDown={initResize}
      className={cn('rcw-conversation-container', className)} aria-live="polite">
      {resizable && <div className="rcw-conversation-resizer" />}
      <Header
        title={title}
        subtitle={subtitle}
        toggleChat={toggleChat}
        showCloseButton={showCloseButton}
        titleAvatar={titleAvatar}
      />
      <ConversationList conversations={conversations}/>
      <Footer />
    </div>
  );
}

export default HomePage;
