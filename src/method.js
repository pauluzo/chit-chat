import Chatkit from '@pusher/chatkit-client';
import {instanceLocator} from './config';
import axios from 'axios';

function handleInput(event) {
  const {value, name} = event.target;

  this.setState({
    [name]: value,
  });
}

function connectToRoom(roomId) {
  const {currentUser} = this.state;

  this.setState({
    messages: [],
  });

  return currentUser
  .subscribeToRoom({
    roomId: `${roomId}`,
    messageLimit: 50,
    hooks: {
      onMessage: message => {
        this.setState({
          messages: [...this.state.messages, message],
        });
      },
      onPresenceChanged: () => {
        const {currentRoom} = this.state;
        if(currentRoom) {
          this.setState({
            roomUsers: currentRoom.users.sort(a => {
              if(a.presence.state === 'online') return -1;
              return 1;
            }),
          });
        }
      }
    }
  })
  .then(currentRoom => {
    const roomName = 
      currentRoom.customData && currentRoom.customData.isDirectMessage
      ? currentRoom.customData.userIds.filter(id => id !== currentUser.id)[0]
      : currentRoom.name;

    this.setState({
      createRoom: false,
      newRoom: '',
      currentRoom,
      roomUsers: currentRoom.users,
      rooms: currentUser.rooms,
      roomName
    });
  })
  .catch(console.error);
}

function connectToChatkit(event) {
  event.preventDefault();

  const {userId} = this.state;

  if(userId === null || userId.trim() === '') {
    alert('Invalid user Id');
    return;
  }

  axios
  .post('https://chat-server-eded4.firebaseapp.com/users', {userId})
  .then(() => {
    const tokenProvider = new Chatkit.TokenProvider({
      url: 'https://chat-server-eded4.firebaseapp.com/authenticate',
    });
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId,
      tokenProvider,
    });

    return chatManager
    .connect({
      onAddedToRoom: room => {
        const {rooms} = this.state;
        this.setState({
          rooms: [...rooms, room],
        });
      },
    })
    .then(currentUser => {
      this.setState({
        currentUser,
        showLogin: false,
        rooms: currentUser.rooms,
      });
      console.log(this.state.rooms);
    })
  })
  .catch(err => {
    console.log(err);
    if(err.toString().includes('status code 502')) {
      alert('Login not successful. No network connection.');
    } else {
      alert(`Login not successful. ${err}`);
    }
  });
}

function sendMessage(event) {
  event.preventDefault();
  const { newMessage, currentUser, currentRoom } = this.state;

  if(newMessage.trim() === '' || !currentRoom) return;

  currentUser.sendMessage({
    text: newMessage,
    roomId: `${currentRoom.id}`
  });

  this.setState({
    newMessage: '',
  })
}

function createPrivateRoom(identity) {
  const id = identity.trim();
  const {currentUser, rooms} = this.state;
  const roomName = `${currentUser.id}_${id}`;
  const isPrivateChatCreated = rooms.filter(room => {
    if(room.customData && room.customData.isDirectMessage) {
      const arr = [currentUser.id, id];
      const {userIds} = room.customData;

      if(arr.sort().join('') === userIds.sort().join('')) {
        return {room};
      }
    }
    return false;
  });

  if(isPrivateChatCreated.length > 0) return Promise.resolve(isPrivateChatCreated[0]);

  return currentUser.createRoom({
    name: `${roomName}`,
    private: true,
    addUserIds: [id],
    customData: {
      isDirectMessage: true,
      userIds: [currentUser.id, id],
    },
  });
}

function sendDM(id) {
  if(!id.length > 0) return alert('Group name or User ID must not be empty');

  createPrivateRoom.call(this, id).then(room => {
    connectToRoom.call(this, room.id);
  }).catch(e => {
    this.setState({createRoom: false})
    alert('This user does not exist. ');
  })
}

function createGroupRoom(input, groupName) {
  const {currentUser, rooms} = this.state;
  const roomName = groupName;
  const userIds = input.split(',');

  if(!groupName.length > 0 || !input.length > 0) return alert('Group name or User ID must not be empty');

  for(let i = 0; i < rooms.length; i++) {
    if(rooms[i] === roomName) {
      alert('You are already a member of a room with this name. Please check and resend');
      return;
    }
  }

  currentUser.createRoom({
    name: `${roomName}`,
    addUserIds: userIds,
    customData: {
      isDirectMessage: false,
      userIds: [...userIds, currentUser.id],
    }
  }).then(room => {
    connectToRoom.call(this, room.id)
  }).catch(e => alert('One of these users does not exist. Please check and resend'));
}

function addToRoom(userId) {
  const {currentUser, currentRoom} = this.state;
  let verifyId;

  for(var i = 0; i < currentRoom.users.length; i++) {
    if(currentRoom.users[i].id === userId) {
      verifyId = currentRoom.users[i].id;
      break;
    }
  }

  if(verifyId) {
    alert(`This user ${verifyId} is already a memeber of the room`);
    return;
  } else {
    currentUser.addUserToRoom({
      userId: userId,
      roomId: currentRoom.id
    })
    .then(() => this.setState({
      addToRoom: false
    }))
    .catch(err => {
      console.log(err);
      alert(`Error adding ${userId} to room ${currentRoom.name}. ${
        err.info.error === 'services/chatkit/invalid_user_id' ? 
        'Invalid User Id' : 'Looks like a connection error'
      }`);
      this.setState({
        addToRoom: false
      })
    })
  }
}

function drawerClickHandler() {
  this.setState((prevState) => {
    return {
      sideDrawerOpen: !prevState.sideDrawerOpen,
      topDrawerOpen: false
    }
  });
}

function headerClickHandler() {
  this.setState((prevState) => {
    return {
      sideDrawerOpen: false,
      topDrawerOpen: !prevState.topDrawerOpen,
    }
  });
}

function backDropClickHandler() {
  this.setState({
    sideDrawerOpen: false,
    topDrawerOpen: false,
  })
}

export {handleInput, connectToChatkit, connectToRoom, sendMessage, sendDM, createGroupRoom, addToRoom, drawerClickHandler, backDropClickHandler, headerClickHandler}