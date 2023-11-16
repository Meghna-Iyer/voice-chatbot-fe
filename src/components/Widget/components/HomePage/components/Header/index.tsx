const close = require('../../../../../../../assets/clear-button.svg') as string;
const settingsIcon = require('../../../../../../../assets/settings-icon.svg') as string;
import './style.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Settings from './Settings'

type Props = {
  title: string;
  subtitle: string;
  toggleChat: () => void;
  showCloseButton: boolean;
  titleAvatar?: string;
}

function Header({ title, subtitle, toggleChat, showCloseButton, titleAvatar }: Props) {
  const [isSetttingsOpen, setIsSetttingsOpen] = useState(false);
  const [userSettings, setUserSettings]  = useState(null);
  const openSettings = () => {
    setIsSetttingsOpen(!isSetttingsOpen); // Toggle the state
  };

  useEffect(()=> {
    const postData = {
      username: "Megh",
      password: "Test@12345"
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
      response => {
        console.log(response);
        const authToken = response.data?.data.access;
        axios.get('http://127.0.0.1:8000/user/info/', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }).then(response => {
          const userSettingsFromResponse: any = {};
          console.log(response);
          userSettingsFromResponse.langPreference = response.data?.data?.attributes?.lang_preference;
          userSettingsFromResponse.isChatHistoryOn = response.data?.data?.attributes?.use_chat_history;

          console.log(userSettingsFromResponse);
          setUserSettings(userSettingsFromResponse);
        })
      }
    )

  }, [isSetttingsOpen])

  const closeSettings = () => {
    setIsSetttingsOpen(false);
  }
  return (
    <div className="rcw-header">
      <button onClick={openSettings} className="settingsIcon">
        <img className="settingsImg" src={settingsIcon} />
      </button>
      {isSetttingsOpen && <Settings onClose={closeSettings} userSettings={userSettings}/>}
      <h4 className={`rcw-title ${isSetttingsOpen ? 'blurred' : ''}`}>
        {titleAvatar && <img src={titleAvatar} className="avatar" alt="profile" />}
        {title}
      </h4>
      <span className={`subtitle ${isSetttingsOpen ? 'blurred' : ''}`}>{subtitle}</span>
    </div>
  );
}

export default Header;
