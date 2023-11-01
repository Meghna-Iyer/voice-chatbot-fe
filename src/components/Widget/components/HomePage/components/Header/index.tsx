const close = require('../../../../../../../assets/clear-button.svg') as string;
const settingsIcon = require('../../../../../../../assets/settings-icon.svg') as string;
import './style.scss';
import React, { useState } from 'react';
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

  const openSettings = () => {
    setIsSetttingsOpen(true);
  }

  const closeSettings = () => {
    setIsSetttingsOpen(false);
  }
  return (
    <div className="rcw-header">
      {showCloseButton &&
        <button className="rcw-close-button" onClick={toggleChat}>
          <img src={close} className="rcw-close" alt="close" />
        </button>
      }
      <button onClick={openSettings} className="settingsIcon">
        <img className="settingsImg" src={settingsIcon} />
      </button>
      {isSetttingsOpen && <Settings onClose={closeSettings}/>}
      <h4 className="rcw-title">
        {titleAvatar && <img src={titleAvatar} className="avatar" alt="profile" />}
        {title}
      </h4>
      <span>{subtitle}</span>
    </div>
  );
}

export default Header;
