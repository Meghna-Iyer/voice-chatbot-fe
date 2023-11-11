import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import axios from 'axios';

import { GlobalState } from 'src/store/types';
import { AnyFunction } from 'src/utils/types';
import { openFullscreenPreview } from '../../store/actions';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import FullScreenPreview from './components/FullScreenPreview';

import './style.scss';
import HomePage from './components/HomePage';

type Props = {
  title: string;
  titleAvatar?: string;
  subtitle: string;
  onSendMessage: AnyFunction;
  onToggleConversation: AnyFunction;
  senderPlaceHolder: string;
  onQuickButtonClicked: AnyFunction;
  profileAvatar?: string;
  profileClientAvatar?: string;
  showCloseButton: boolean;
  fullScreenMode: boolean;
  autofocus: boolean;
  customLauncher?: AnyFunction;
  onTextInputChange?: (event: any) => void;
  chatId: string;
  launcherOpenLabel: string;
  launcherCloseLabel: string;
  launcherCloseImg: string;
  launcherOpenImg: string;
  sendButtonAlt: string;
  showTimeStamp: boolean;
  imagePreview?: boolean;
  zoomStep?: number;
  showBadge?: boolean;
  resizable?: boolean;
  emojis?: boolean;
  addResponseMessage?: AnyFunction;
  handleDropMessages?: AnyFunction;
}

function WidgetLayout({
  title,
  titleAvatar,
  subtitle,
  onSendMessage,
  onToggleConversation,
  senderPlaceHolder,
  onQuickButtonClicked,
  profileAvatar,
  profileClientAvatar,
  showCloseButton,
  fullScreenMode,
  autofocus,
  customLauncher,
  onTextInputChange,
  chatId,
  launcherOpenLabel,
  launcherCloseLabel,
  launcherCloseImg,
  launcherOpenImg,
  sendButtonAlt,
  showTimeStamp,
  imagePreview,
  zoomStep,
  showBadge,
  resizable,
  emojis,
  addResponseMessage,
  handleDropMessages
}: Props) {
  const dispatch = useDispatch();
  const { dissableInput, showChat, visible } = useSelector((state: GlobalState) => ({
    showChat: state.behavior.showChat,
    dissableInput: state.behavior.disabledInput,
    visible: state.preview.visible,
  }));

  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversationWithMsgs, setConversationWithMsgs] = useState(null);

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(showChat) {
      messageRef.current = document.getElementById('messages') as HTMLDivElement;
    }
    return () => {
      messageRef.current = null;
    }
  }, [showChat])

  const eventHandle = evt => {
    if(evt.target && evt.target.className === 'rcw-message-img') {
      const { src, alt, naturalWidth, naturalHeight } = (evt.target as HTMLImageElement);
      const obj = {
        src: src,
        alt: alt,
        width: naturalWidth,
        height: naturalHeight,
      };
      dispatch(openFullscreenPreview(obj))
    }
  }

  /**
   * Previewer needs to prevent body scroll behavior when fullScreenMode is true
   */
  useEffect(() => {
    const target = messageRef?.current;
    if(imagePreview && showChat) {
      target?.addEventListener('click', eventHandle, false);
    }

    return () => {
      target?.removeEventListener('click', eventHandle);
    }
  }, [imagePreview, showChat]);

  useEffect(() => {
    document.body.setAttribute('style', `overflow: ${visible || fullScreenMode ? 'hidden' : 'auto'}`)
  }, [fullScreenMode, visible])

  const onConversationSelect = (conversationInfo: any, addResponseMessage: AnyFunction) => {
    if(conversationInfo.isNew) {
      setCurrentConversation(conversationInfo);
    }
    else {
      console.log(conversationInfo);
      const postData = {
        username: "Megh",
        password: "Test@12345"
      }
      axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
        response => {
          const authToken = response.data?.data.access;
          axios.get(`http://127.0.0.1:8000/core/messages/${conversationInfo.id}/`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }).then(response => {
            const conversationWithMsgs: any = {};
            console.log(response);
            conversationWithMsgs.messages = response.data?.data?.messages;
            conversationWithMsgs.id = conversationInfo.id;
            conversationWithMsgs.title = conversationInfo.title;
            console.log(conversationWithMsgs);
            setConversationWithMsgs(conversationWithMsgs);
            conversationWithMsgs.messages.reverse().forEach((message)=>{
              addResponseMessage(message);
            })
            setCurrentConversation(conversationInfo);
          })
        }
      )
    }


  }

  const onBackButtonClick = (handleDropMessages) => {
    setCurrentConversation(null);
    setConversationWithMsgs(null);
    handleDropMessages();
  }
  return (
    <div
      className={cn('rcw-widget-container', {
        'rcw-full-screen': fullScreenMode,
        'rcw-previewer': imagePreview,
        'rcw-close-widget-container ': !showChat
        })
      }
    >
      {currentConversation? (<Conversation
          title={currentConversation.title}
          testMessages={conversationWithMsgs?.messages}
          sendMessage={onSendMessage}
          senderPlaceHolder={senderPlaceHolder}
          profileAvatar={profileAvatar}
          profileClientAvatar={profileClientAvatar}
          toggleChat={onToggleConversation}
          showCloseButton={showCloseButton}
          disabledInput={dissableInput}
          autofocus={autofocus}
          titleAvatar={titleAvatar}
          className={showChat ? 'active' : 'hidden'}
          onQuickButtonClicked={onQuickButtonClicked}
          onTextInputChange={onTextInputChange}
          sendButtonAlt={sendButtonAlt}
          showTimeStamp={showTimeStamp}
          resizable={resizable}
          emojis={emojis}
          addResponseMessage={addResponseMessage}
          onBackButtonClick={onBackButtonClick}
        />) : (<HomePage
          title={title}
          subtitle={subtitle}
          sendMessage={onSendMessage}
          senderPlaceHolder={senderPlaceHolder}
          profileAvatar={profileAvatar}
          profileClientAvatar={profileClientAvatar}
          toggleChat={onToggleConversation}
          showCloseButton={showCloseButton}
          disabledInput={dissableInput}
          autofocus={autofocus}
          titleAvatar={titleAvatar}
          className={showChat ? 'active' : 'hidden'}
          onQuickButtonClicked={onQuickButtonClicked}
          onTextInputChange={onTextInputChange}
          sendButtonAlt={sendButtonAlt}
          showTimeStamp={showTimeStamp}
          resizable={resizable}
          emojis={emojis}
          onConversationSelect={onConversationSelect}
          addResponseMessage={addResponseMessage}
        />)
      }
      {customLauncher ?
        customLauncher(onToggleConversation) :
        !fullScreenMode &&
        <Launcher
          toggle={onToggleConversation}
          chatId={chatId}
          openLabel={launcherOpenLabel}
          closeLabel={launcherCloseLabel}
          closeImg={launcherCloseImg}
          openImg={launcherOpenImg}
          showBadge={showBadge}
        />
      }
      {
        imagePreview && <FullScreenPreview fullScreenMode={fullScreenMode} zoomStep={zoomStep} />
      }
    </div>
  );
}

export default WidgetLayout;
