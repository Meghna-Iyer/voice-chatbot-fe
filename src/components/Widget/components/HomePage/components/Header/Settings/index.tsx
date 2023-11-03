import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import axios from 'axios';
import './style.scss';

const Settings = ({ onClose, userSettings }) => {

  const [checked, setChecked] = useState(true);
  const languagesList = ["en","es","en-us","en-uk"];
  const handleChange = val => {
    console.log(val);
    setChecked(val)
    updateChange(val)
  }
  function updateChange(isChecked) {
    const postData = {
      username: "Anandh",
      password: "test@12345"
    }
    axios.post('http://127.0.0.1:8000/user/auth/token/', postData).then(
      response => {
        console.log(response);
        const authToken = response.data?.data.access;
        const updateToggle = {
          "use_chat_history": isChecked
        }
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

  useEffect(() => {
    setChecked(userSettings.isChatHistoryOn);
  },[])

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
          <select value={userSettings.langPreference}>
            <option value="en">en</option>
            <option value="es">es</option>
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