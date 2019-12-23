import React from 'react';
import Proptypes from 'prop-types';

const RoomUsers = props => {
  const { roomUsers, currentUser, sendDM } = props;
  const users = roomUsers.map(user => {
    return (
      <li className="room-member" key={user.id}>
        <div>
          <span className={`presence ${user.presence.state}`} />
          <span>{user.name}</span>
        </div>
        {currentUser.id !== user.id ? (
          <button
            title={`Send ${user.name} a direct message`}
            className="send-dm"
            onClick={() => sendDM(user.id)}
          >
            +
          </button>
        ) : null}
      </li>
    );
  });

  return (
    <div className="room-users">
      <ul>{users}</ul>
    </div>
  );
};

RoomUsers.propTypes = {
  roomUsers: Proptypes.array.isRequired,
  currentUser: Proptypes.object.isRequired,
  sendDM: Proptypes.func.isRequired,
};

export default RoomUsers;