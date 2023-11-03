import React, { useState } from 'react';
import ReactSwitch from 'react-switch';

import './style.scss';

const Settings = ({ onClose, userSettings }) => {

  const [checked, setChecked] = useState(true);
  const languagesList = ["en","es","en-us","en-uk"];
  const handleChange = val => {
    setChecked(val)
  }
  console.log(userSettings);
  return (
    <div className="settings">
      <div>
        Enable history :
      <ReactSwitch
        checked={userSettings.isChatHistoryOn}
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