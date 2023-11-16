import format from 'date-fns/format';
import axios from 'axios';
import { MessageTypes } from 'src/store/types';

import './styles.scss';

type Props = {
  message: MessageTypes;
  showTimeStamp: boolean;
}

function Message({ message, showTimeStamp }: Props) {

  function handleOnMessageClick(message: any) {
    if(message.reference){
      console.log("message is clicked");
      const audio = new Audio(`http://127.0.0.1:8000${message.reference}`);
      audio.play();
    }
    else  {
      const postData = {
        refresh: localStorage.getItem('refreshToken')?.replace(/^"(.+(?="$))"$/, '$1')
      }
      const ttsData = {
        text: message.text
      }
      axios.post('http://127.0.0.1:8000/user/auth/token/refresh/', postData).then(
        response => {
          const authToken = response.data?.data.access;
          axios.post(`http://127.0.0.1:8000/core/text-to-speech/`,ttsData, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }).then(response => {
            console.log(response.data.data);
            const byteCharacters = atob(response.data.data.audio_base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const audioUrl = URL.createObjectURL(new Blob([byteArray], { type: 'audio/mp3' }));
            const audio = new Audio(audioUrl);
            audio.play();
          })
        }
      )
    }
  }
  let sanitizedHTML =  message.text + "🔊"
  console.log(message);
  let audioSrc:any = `http://127.0.0.1:8000${message.reference}`;
  if(message.text == 'PRE_CREATED'){
    audioSrc = message.reference;
  }
  return (
    <div className={`rcw-${message.sender}`}>

      <div key={// @ts-ignore
      message.id}>
  {message.reference ? (
    <audio id="audioElement" controls src={audioSrc}></audio>
  ) : (
    <div className="rcw-message-text">
      <p onClick={() => handleOnMessageClick(message)}>{sanitizedHTML}</p>
    </div>
  )}
</div>
      {showTimeStamp && <span className="rcw-timestamp">{format(message.timestamp, 'd/MM hh:mm.aaaa')}</span>}
    </div>
  );
}

export default Message;
