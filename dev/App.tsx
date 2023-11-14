import { Component } from 'react';

import { Widget, addResponseMessage, deleteMessages, setQuickButtons, toggleMsgLoader, addLinkSnippet, dropMessages } from '../index';
import { addUserMessage } from '..';

export default class App extends Component {
  handleResponseMessage = (message: any) => {
    if(message.message_user_type == 'BOT'){
      addResponseMessage(message.content, message.created);
    }
    else {
      console.log("newwww")
      console.log(message.reference)
      addUserMessage(message.content, message.created, message.reference);
    }

  }
  handleDropMessages = () => {
    dropMessages();
  }
  handleNewUserMessage = (newMessage: any) => {
    toggleMsgLoader();
    // setTimeout(() => {
    //   toggleMsgLoader();
    //   if (newMessage === 'fruits') {
    //     setQuickButtons([ { label: 'Apple', value: 'apple' }, { label: 'Orange', value: 'orange' }, { label: 'Pear', value: 'pear' }, { label: 'Banana', value: 'banana' } ]);
    //   } else {
    //     addResponseMessage(newMessage);
    //   }
    // }, 2000);
  }

  handleQuickButtonClicked = (e: any) => {
    addResponseMessage('Selected ' + e);
    setQuickButtons([]);
  }

  handleSubmit = (msgText: string) => {
    return true;
  }

  render() {
    console.log('testting on app level addResponseMessage');
    console.log(this.handleDropMessages);
    return (
      <Widget
        title="Hello there!"
        subtitle="How can we help?"
        senderPlaceHolder="Enter your message here ..."
        handleNewUserMessage={this.handleNewUserMessage}
        handleResponseMessage={this.handleResponseMessage}
        handleDropMessages={this.handleDropMessages}
        handleQuickButtonClicked={this.handleQuickButtonClicked}
        imagePreview
        handleSubmit={this.handleSubmit}
        emojis
      />
    );
  }
}
