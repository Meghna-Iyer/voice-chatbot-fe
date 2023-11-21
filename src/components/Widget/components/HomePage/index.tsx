import { useRef, useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import cn from 'classnames';

import Header from './components/Header';
import axios from 'axios';

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
  onConversationSelect: AnyFunction;
  addResponseMessage?: AnyFunction;
};

function HomePage({
  title,
  subtitle,
  showCloseButton,
  className,
  toggleChat,
  titleAvatar,
  resizable,
  onConversationSelect,
  addResponseMessage
}: Props) {
  const [containerDiv, setContainerDiv] = useState<HTMLElement | null>();
  let startX, startWidth;
  const [conversationList, setConversationList] = useState([]);

  useEffect(() => {
    const containerDiv = document.getElementById('rcw-conversation-container');
    setContainerDiv(containerDiv);
    const postData = {
      refresh: localStorage.getItem('refreshToken')?.replace(/^"(.+(?="$))"$/, '$1')
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/refresh/', postData).then(
      response => {
        const authToken = response.data?.data.access;
        axios.get('http://127.0.0.1:8000/core/conversations/', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }).then(response => {
          const conversationList: any = [];
          console.log(response);
          response.data?.data?.conversations?.forEach((conversation: any) => {
            console.log(conversation);
            conversationList.push(conversation)
          })
          console.log(conversationList);
          setConversationList(conversationList);
        })
      }
    )


  }, []);

  const onConversationDelete = (conversationInfo) => {
    const postData = {
      refresh: localStorage.getItem('refreshToken')?.replace(/^"(.+(?="$))"$/, '$1')
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/refresh/', postData).then(
        response => {
          const authToken = response.data?.data.access;
          axios.delete(`http://127.0.0.1:8000/core/conversation/${conversationInfo.id}/`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }).then(response => {
            console.log(response);
            const newConvUpdate: any = conversationList.reduce((convList:any[], conv:any)=> {
              if(conversationInfo.id !== conv.id){
                convList.push(conv);
              }
              return convList;
            }, []);
            setConversationList(newConvUpdate);
          })
        }
      )
  };

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
      <ConversationList conversations={conversationList} onConversationSelect={onConversationSelect} addResponseMessage={addResponseMessage} onConversationDelete={onConversationDelete}/>
      <Footer onConversationSelect={onConversationSelect} />
    </div>
  );
}

export default HomePage;
