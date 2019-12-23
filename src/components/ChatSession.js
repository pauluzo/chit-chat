import React from 'react';
import Proptypes from 'prop-types';
import {format} from 'date-fns';

const ChatSession = props => {
  const user = props.user;
  const {messages}  = props;
  return messages.map(message => {
    const time = format(new Date(`${message.updatedAt}`), 'HH:mm');

    return(
      <li className={(user && user.id === message.senderId) ? 'message-container user' : 'message-container'} key={message.id}>
        <div className='message'>
          <div>
            <span className='user-id'>{message.senderId}</span>
            <span>{message.text}</span>
          </div>
          <span className='message-time'>{time}</span>
        </div>
      </li>
    );
  });   
}

ChatSession.propTypes = {
  messages: Proptypes.arrayOf(Proptypes.object).isRequired,
}

export default ChatSession;
