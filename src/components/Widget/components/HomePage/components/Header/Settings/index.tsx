import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import axios from 'axios';
import './style.scss';

const Settings = ({ onClose, userSettings }) => {

  const [checked, setChecked] = useState(userSettings.isChatHistoryOn);
  const [languagePref, setLanguagePref] = useState(userSettings.langPreference);
  let userSettingsUpdate: any = {}
  const languagesList = ["en","es","en-us","en-uk"];
  const handleChange = val => {
    console.log(val);
    setChecked(val)
    userSettingsUpdate.useChatHistory = val;
    updateChange(userSettingsUpdate);
  }
  const handeLangChange = (e:any) => {
    console.log('Event object:', e.target.value);
    setLanguagePref(e.target.val);
    userSettingsUpdate.langPreference = e.target.value;
    updateChange(userSettingsUpdate);
  }
  function updateChange(userSettingsUpdate) {
    console.log(userSettingsUpdate);
    const postData = {
      username: "Anandh",
      password: "test@12345"
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
      response => {
        console.log(response);
        const authToken = response.data?.data.access;
        const updateToggle = {
          "use_chat_history": userSettingsUpdate.useChatHistory,
          "lang_preference": userSettingsUpdate.langPreference
        }
        console.log(updateToggle);
        axios.put('http://127.0.0.1:8000/user/update/',updateToggle, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }).then(response => {
          console.log(response);
        })
      }
    )
  }

  console.log(userSettings);
  return (
    <div className="settings">
      <div>
        Enable history :
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
      />
      </div>

      <div>
        <label>
          Language Preference :
          <select value={languagePref} onChange={handeLangChange}>
            {languagesList.map((language, index)=> (
              <option value={language}>{language}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
      <button className='closeSettings' onClick={onClose}>Close</button>
      </div>
      </div>
  );
}

export default Settings;