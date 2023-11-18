import { useRef, useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';
import cn from 'classnames';
import axios from 'axios';


import Header from './components/Header';
import Messages from './components/Messages';
import Sender from './components/Sender';
import QuickButtons from './components/QuickButtons';

import { AnyFunction } from '../../../../utils/types';

import './style.scss';

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
  testMessages?: any[];
  addResponseMessage: AnyFunction;
  onBackButtonClick: AnyFunction;
  handleDropMessages: AnyFunction;
  conversationId: string;
  setWebsocketState: AnyFunction;
};

function Conversation({
  title,
  conversationId,
  subtitle,
  senderPlaceHolder,
  showCloseButton,
  disabledInput,
  autofocus,
  className,
  sendMessage,
  toggleChat,
  profileAvatar,
  profileClientAvatar,
  titleAvatar,
  onQuickButtonClicked,
  onTextInputChange,
  sendButtonAlt,
  showTimeStamp,
  resizable,
  emojis,
  testMessages,
  addResponseMessage,
  onBackButtonClick,
  handleDropMessages,
  setWebsocketState
}: Props) {
  const [containerDiv, setContainerDiv] = useState<HTMLElement | null>();
  const [conversationIdState, setConversationIdState] = useState(conversationId);
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

  const [pickerOffset, setOffset] = useState(0)
  const senderRef = useRef<ISenderRef>(null!);
  const [pickerStatus, setPicket] = useState(false)

  const onSelectEmoji = (emoji) => {
    senderRef.current?.onSelectEmoji(emoji)
  }

  const togglePicker = () => {
    setPicket(prevPickerStatus => !prevPickerStatus)
  }
  console.log("inside conversation component function");
  console.log(conversationIdState);
  const handlerSendMsn = (event) => {
    if(conversationIdState){
      // const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationIdState}/`);
      // console.log(ws);
      // ws.onopen = () => {
      //   console.log('WebSocket connection opened');
      // };
      // ws.onmessage = (event) => {
      //   console.log('Message received: ' + event.data);
      //   const messagePayload = JSON.parse(event.data);
      //   console.log(messagePayload);
      //   if(messagePayload?.message?.message_user_type == "BOT") {
      //     console.log('gonna send bot message');
      //     addResponseMessage(messagePayload?.message);
      //   }
      // };
    }

    const postData = {
      refresh: localStorage.getItem('refreshToken')?.replace(/^"(.+(?="$))"$/, '$1')
    }
    const postMessageData: any = {
      input_text: event
    }
    console.log("inside send message after sending message");
    console.log(conversationIdState);
    if(conversationIdState)
      postMessageData.conversation_id = conversationIdState;
    axios.post('http://127.0.0.1:8000/user/auth/token/refresh/', postData).then(
        response => {
          const authToken = response.data?.data.access;
          axios.post('http://127.0.0.1:8000/core/chatbot/text/', postMessageData, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }).then(response => {
            let wsConvId = conversationIdState;
            console.log(response);
            if(!wsConvId){
              console.log("new chat coming from response");
              const newChatMsg = response.data?.data?.messages[1];
              newChatMsg.id = newChatMsg.message_id;
              setConversationIdState(response.data?.data?.conversation.id)
              addResponseMessage(newChatMsg);
              const ws = new WebSocket(`ws://localhost:8000/ws/chat/${response.data?.data?.conversation.id}/`);
              console.log(setWebsocketState)
              console.log(ws);
              ws.onopen = () => {
                console.log('WebSocket connection opened');
              };
              ws.onmessage = (event) => {
                console.log('Message received: ' + event.data);
                const messagePayload = JSON.parse(event.data);
                console.log(messagePayload);
                // if(messagePayload?.message?.message_user_type == "BOT") {
                console.log('gonna send bot message');
                messagePayload.message.id = messagePayload.message.message_id;
                addResponseMessage(messagePayload?.message);
                // }
              };
              ws.onclose = () => {
                console.log("websocket connection closed");
              }
              setWebsocketState(ws);
            }
          })
        }
      )
    if(!conversationIdState)
      sendMessage(event)
    if(pickerStatus) setPicket(false)
  }
  console.log('test onbackbutton click');
  console.log(onBackButtonClick);
  // testMessages?.forEach((message)=>{
  //   addResponseMessage(message.content);
  // })
  return (
    <div id="rcw-conversation-container" onMouseDown={initResize}
      className={cn('rcw-conversation-container', className)} aria-live="polite">
      {resizable && <div className="rcw-conversation-resizer" />}
      <Header
        title={title}
        toggleChat={toggleChat}
        showCloseButton={showCloseButton}
        titleAvatar={titleAvatar}
        onBackButtonClick={onBackButtonClick}
        handleDropMessages={handleDropMessages}
      />
      <Messages
        profileAvatar={profileAvatar}
        profileClientAvatar={profileClientAvatar}
        showTimeStamp={showTimeStamp}
      />
      <QuickButtons onQuickButtonClicked={onQuickButtonClicked} />
      {emojis && pickerStatus && (<Picker
        style={{ position: 'absolute', bottom: pickerOffset, left: '0', width: '100%' }}
        onSelect={onSelectEmoji}
      />)}
      <Sender
        ref={senderRef}
        sendMessage={handlerSendMsn}
        conversationId={conversationId}
        addResponseMessage={addResponseMessage}
        placeholder={senderPlaceHolder}
        disabledInput={disabledInput}
        autofocus={autofocus}
        onTextInputChange={onTextInputChange}
        buttonAlt={sendButtonAlt}
        onPressEmoji={togglePicker}
        onChangeSize={setOffset}
        conversationIdState={conversationIdState}
        setConversationIdState={setConversationIdState}
      />
    </div>
  );
}

export default Conversation;
