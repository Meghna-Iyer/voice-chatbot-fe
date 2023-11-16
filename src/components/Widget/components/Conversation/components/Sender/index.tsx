import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { GlobalState } from 'src/store/types';
import axios from 'axios';

import { getCaretIndex, isFirefox, updateCaret, insertNodeAtCaret, getSelection } from '../../../../../../utils/contentEditable'
const send = require('../../../../../../../assets/send_button.svg') as string;
const recordingState = require('../../../../../../../assets/voice-record.gif') as string;
const voiceRecord = require('../../../../../../../assets/voice-record.svg') as string
const brRegex = /<br>/g;

import './style.scss';
import { AnyFunction } from 'src/utils/types';

type Props = {
  placeholder: string;
  disabledInput: boolean;
  autofocus: boolean;
  conversationId: string;
  sendMessage: (event: any) => void;
  buttonAlt: string;
  onPressEmoji: () => void;
  onChangeSize: (event: any) => void;
  onTextInputChange?: (event: any) => void;
  addResponseMessage: AnyFunction;
}

function Sender({ sendMessage, placeholder, disabledInput, autofocus, onTextInputChange, buttonAlt, onPressEmoji, onChangeSize, conversationId, addResponseMessage  }: Props, ref) {
  const showChat = useSelector((state: GlobalState) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const [isRecording, setIsRecording] = useState(false);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter]= useState(false)
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [conversationIdState, setConversationIdState] = useState(conversationId);
  let recordedChunks = [];
  // @ts-ignore
  useEffect(() => { if (showChat && autofocus) inputRef.current?.focus(); }, [showChat]);
  useEffect(() => { setFirefox(isFirefox())}, [])

  useImperativeHandle(ref, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const handlerOnChange = (event) => {
    onTextInputChange && onTextInputChange(event)
  }
  const handlerSendMessage = () => {
    if(audioBlob){
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.ogg');
      console.log(formData);
    }
    else {
      const el = inputRef.current;
      if(el.innerHTML) {
        sendMessage(el.innerText);
        el.innerHTML = ''
      }
    }

  }

  const handlerOnSelectEmoji = (emoji) => {
    const el = inputRef.current;
    const { start, end } = getSelection(el)
    if(el.innerHTML) {
      const firstPart = el.innerHTML.substring(0, start);
      const secondPart = el.innerHTML.substring(end);
      el.innerHTML = (`${firstPart}${emoji.native}${secondPart}`)
    } else {
      el.innerHTML = emoji.native
    }
    updateCaret(el, start, emoji.native.length)
  }

  const handlerOnKeyPress = (event) => {
    const el = inputRef.current;

    if(event.charCode == 13 && !event.shiftKey) {
      event.preventDefault()
      handlerSendMessage();
    }
    if(event.charCode === 13 && event.shiftKey) {
      event.preventDefault()
      insertNodeAtCaret(el);
      setEnter(true)
    }
  }

  // TODO use a context for checkSize and toggle picker
  const checkSize = () => {
    const senderEl = refContainer.current
    if(senderEl && height !== senderEl.clientHeight) {
      const {clientHeight} = senderEl;
      setHeight(clientHeight)
      onChangeSize(clientHeight ? clientHeight -1 : 0)
    }
  }

  const handlerOnKeyUp = (event) => {
    const el = inputRef.current;
    if(!el) return true;
    // Conditions need for firefox
    if(firefox && event.key === 'Backspace') {
      if(el.innerHTML.length === 1 && enter) {
        el.innerHTML = '';
        setEnter(false);
      }
      else if(brRegex.test(el.innerHTML)){
        el.innerHTML = el.innerHTML.replace(brRegex, '');
      }
    }
    checkSize();
  }

  const handlerOnKeyDown= (event) => {
    const el = inputRef.current;

    if( event.key === 'Backspace' && el){
      const caretPosition = getCaretIndex(inputRef.current);
      const character = el.innerHTML.charAt(caretPosition - 1);
      if(character === "\n") {
        event.preventDefault();
        event.stopPropagation();
        el.innerHTML = (el.innerHTML.substring(0, caretPosition - 1) + el.innerHTML.substring(caretPosition))
        updateCaret(el, caretPosition, -1)
      }
    }
  }

  const handleVoiceNotePress = () => {
    if(isRecording){
      setIsRecording(false);
      // @ts-ignore
      mediaRecorder.stop();
      recordedChunks = [];
      setMediaRecorder(null);
    }
    else {
      setIsRecording(true);
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          const mediaRecorderTemp = new MediaRecorder(stream);
          // @ts-ignore
          setMediaRecorder(mediaRecorderTemp);
          mediaRecorderTemp.ondataavailable = event => {
              if (event.data.size > 0) {
                // @ts-ignore
                  recordedChunks.push(event.data);
              }
          };
          mediaRecorderTemp.onstop = () => {
              const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
              const audioUrl = URL.createObjectURL(audioBlob);
              // audioElement.src = audioUrl;

              // Send audio to the server
              console.log(audioBlob);
              console.log(`Audio url: ${audioUrl}`);
              // const audio = new Audio(audioUrl);
              // audio.play();

              if(conversationIdState) {
                console.log(`Websocket opening for ${conversationIdState}`)
                const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationIdState}/`);
                console.log(ws);
                ws.onopen = () => {
                  console.log('WebSocket connection opened');
                };
                ws.onmessage = (event) => {
                  console.log('Message received: ' + event.data);
                  const messagePayload = JSON.parse(event.data);
                  console.log(messagePayload);
                  if(messagePayload?.message?.message_user_type == "BOT") {
                    console.log('gonna send bot message');
                    addResponseMessage(messagePayload?.message);
                  }
                };
              }
              const postData = {
                username: "Megh",
                password: "Test@12345"
              }
              const formData = new FormData();
              formData.append("audio", audioBlob, 'test_audio.wav');
              if(conversationIdState) {
                formData.append("conversation_id", conversationIdState)
              }
              let message: any = {};
              message.message_user_type = 'user'
              message.content = 'PRE_CREATED';
              message.reference = new String(audioUrl);
              message.created = new Date().toLocaleString();
              console.log(message);
              addResponseMessage(message);
              axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
                response => {
                  const authToken = response.data?.data.access;
                  axios.post(`http://127.0.0.1:8000/core/chatbot/voice/`,formData, {
                    headers: {
                      'Authorization': `Bearer ${authToken}`,
                      'Content-Type': 'multipart/form-data'
                    }
                  }).then(response => {
                    console.log(response);
                    console.log("new chat coming from response");
                    const incomingMessages = response.data?.data?.messages;
                    if(!conversationIdState){
                      setConversationIdState(response.data?.data?.conversation.id)
                      // addResponseMessage(incomingMessages[0]);
                      addResponseMessage(incomingMessages[1]);
                    }

                  })
                }
              )
          };
          mediaRecorderTemp.start();
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
    });
    }
    // onPressEmoji();
    // checkSize();
  }

  return (
    <div ref={refContainer} className="rcw-sender">
      <div className={cn('rcw-new-message', {
          'rcw-message-disable': disabledInput,
        })
      }>
        <div
          spellCheck
          className="rcw-input"
          role="textbox"
          contentEditable={!disabledInput}
          ref={inputRef}
          placeholder={placeholder}
          onInput={handlerOnChange}
          onKeyPress={handlerOnKeyPress}
          onKeyUp={handlerOnKeyUp}
          onKeyDown={handlerOnKeyDown}
        />

      </div>
      <button className='voiceButton' type="submit" onClick={handleVoiceNotePress}>
        {isRecording?
        <img src={recordingState} className="recordingState" alt="" />:
        <img src={voiceRecord} className="voiceIcon" alt="" />}
      </button>
      <button type="submit" className="rcw-send" onClick={handlerSendMessage}>
        <img src={send} className="rcw-send-icon" alt={buttonAlt} />
      </button>
    </div>
  );
}

export default forwardRef(Sender);
