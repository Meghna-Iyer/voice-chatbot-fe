import { useState } from 'react';
import axios from 'axios';

const close = require('../../../../../../../assets/clear-button.svg') as string;
const settingsIcon = require('../../../../../../../assets/back-icon.svg') as string;
const convNameEdit = require('../../../../../../../assets/conversation-name-edit.svg') as string;

import { AnyFunction } from 'src/utils/types';
import './style.scss';

type Props = {
  title: string;
  toggleChat: () => void;
  showCloseButton: boolean;
  titleAvatar?: string;
  onBackButtonClick: AnyFunction;
  handleDropMessages: AnyFunction;
  conversationIdState: string;
}

function Header({ title, toggleChat, showCloseButton, titleAvatar, onBackButtonClick, handleDropMessages, conversationIdState }: Props) {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEditButtonClick = () => {
    setEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveButtonClick();
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveButtonClick = () => {
    // Implement logic to save the edited title
    // For example, you can send an API request to update the title
    console.log("Edited Title:", editedTitle);
    const postData = {
      refresh: localStorage.getItem('refreshToken')?.replace(/^"(.+(?="$))"$/, '$1')
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/refresh/', postData).then(
        response => {
          const authToken = response.data?.data.access;
          const convUpdateData = {
            title: editedTitle
          }
          axios.put(`http://127.0.0.1:8000/core/conversation/${conversationIdState}/`, convUpdateData, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }).then(response => {
            if(response.ok){
              setEditedTitle(editedTitle);
            }
          })
        }
      )
    // Reset the editing state
    setEditing(false);
  };


  return (
    <div className="rcw-header">
    <button onClick={() => onBackButtonClick(handleDropMessages)} className="backIcon">
      <img className="backImg" src={settingsIcon} alt="Back" />
    </button>
    <div className="title-container">
      {editing &&
        <input
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveButtonClick()}
          className="editInput"
        />
      }
      {!editing &&
        <span className="conversation-title">
          {editedTitle}
        </span>
      }
      <span className="editButton" onClick={() => setEditing(!editing)}>
        <img src={convNameEdit} alt="Edit" />
      </span>
    </div>
  </div>
);
}

export default Header;
