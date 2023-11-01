import React, { useState } from 'react';
import ReactSwitch from 'react-switch';

import './style.scss';

const Settings = ({ onClose }) => {

  const [checked, setChecked] = useState(true);

  const handleChange = val => {
    setChecked(val)
  }

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
          <select>
            <option value="en-us">en-us</option>
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