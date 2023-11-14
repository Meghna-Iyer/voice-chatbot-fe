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
    else if(message.sender == 'response') {
      const postData = {
        username: "Anandh",
        password: "test@12345"
      }
      const ttsData = {
        text: message.text
      }
      axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
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
  let sanitizedHTML = message.reference || message.sender == "response" ? message.text + "🔊": message.text;
  console.log(message);

  return (
    <div className={`rcw-${message.sender}`}>
      <div className="rcw-message-text">
        <p onClick={()=>handleOnMessageClick(message)}>{sanitizedHTML}</p>
      </div>
      {showTimeStamp && <span className="rcw-timestamp">{format(message.timestamp, 'd/MM hh:mm.aaaa')}</span>}
    </div>
  );
}

export default Message;
