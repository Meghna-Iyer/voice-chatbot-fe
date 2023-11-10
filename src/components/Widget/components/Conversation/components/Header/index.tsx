const close = require('../../../../../../../assets/clear-button.svg') as string;
const settingsIcon = require('../../../../../../../assets/back-icon.svg') as string;

import { AnyFunction } from 'src/utils/types';
import './style.scss';

type Props = {
  title: string;
  toggleChat: () => void;
  showCloseButton: boolean;
  titleAvatar?: string;
  onBackButtonClick: AnyFunction;
  handleDropMessages: AnyFunction;
}

function Header({ title, toggleChat, showCloseButton, titleAvatar, onBackButtonClick, handleDropMessages }: Props) {
  return (
    <div className="rcw-header">
      <button onClick={() => onBackButtonClick(handleDropMessages)} className="backIcon">
        <img className="backImg" src={settingsIcon} />
      </button>
      <h4 className="conversation-title">
        {titleAvatar && <img src={titleAvatar} className="avatar" alt="profile" />}
        {title}
      </h4>
      <span>Have a Question?</span>
    </div>
  );
}

export default Header;
