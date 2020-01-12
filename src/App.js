import React, {Component} from 'react';
import {handleInput, addToRoom, connectToChatkit, connectToRoom, sendMessage, createGroupRoom, sendDM, drawerClickHandler, backDropClickHandler, headerClickHandler} from './method';
import {Dialog, CreateRoomDialog, AddToRoom} from './components/Dialog';
import RoomList from './components/RoomList';
import ChatSession from './components/ChatSession';
import RoomUsers from './components/RoomUsers';
import BackDrop from './components/miniScreens/BackDrop';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle, faPaperPlane, faBars} from '@fortawesome/free-solid-svg-icons';
import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';
import './App.css';

class App extends Component {
  handleInput = handleInput;
  connectToChatkit = connectToChatkit;
  connectToRoom = connectToRoom;
  sendMessage = sendMessage;
  createGroupRoom = createGroupRoom;
  sendDM = sendDM;
  addToRoom = addToRoom;
  drawerClickHandler = drawerClickHandler;
  backDropClickHandler = backDropClickHandler;
  headerClickHandler = headerClickHandler;
  
  constructor() {
    super();
    this.state = {
      userId: '',
      showLogin: false,
      isLoading: false,
      currentUser: null,
      currentRoom: null,
      rooms: [],
      roomUsers: [],
      roomName: null,
      messages: [],
      newMessage: '',
      newRoom: '',
      createRoom: false,
      addToRoom: false,
      sideDrawerOpen: false,
      topDrawerOpen: false
    }

    this.handleInput = this.handleInput.bind(this);
    this.connectToChatkit = connectToChatkit.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.sendDM = sendDM.bind(this);
    this.createGroupRoom = this.createGroupRoom.bind(this);
    this.addToRoom = this.addToRoom.bind(this);
    this.drawerClickHandler = this.drawerClickHandler.bind(this);
    this.backDropClickHandler = this.backDropClickHandler.bind(this);
    this.headerClickHandler = this.headerClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      showLogin: true
    })
  }

  setFalse = () => {
    this.setState({
      createRoom: false
    })
  }

  render() {
    const { userId, addToRoom, showLogin, currentRoom, currentUser, newRoom, rooms, roomUsers, roomName, messages, newMessage, createRoom, sideDrawerOpen, topDrawerOpen} = this.state;
    const leftBar = (
      <aside className='sidebar left-sidebar'>
          { currentUser ? (
            <div className='user-profile'>
              <span className='username'>{currentUser.name}</span>
              <span className='user-id'>{`@${currentUser.id}`}</span>
            </div>
            ) : null
          }
          { rooms && currentUser ? (
            <RoomList 
              handler={this.backDropClickHandler}
              rooms={rooms}
              currentRoom={currentRoom}
              connectToRoom={this.connectToRoom}
              currentUser={currentUser}
            />
            ) : null 
          }
          { currentUser ? (
            <div className='add-room'>
              <select style={{margin: '0px', height: '30px'}} 
                onChange={(e) => {this.setState({newRoom: e.target.value})}}
                value={newRoom}
              >
                <option value='newroom'>New Room</option>
                <option value='private'>Private </option>
                <option value='group'>Group </option>
              </select>
              <FontAwesomeIcon 
                icon={faPlusCircle} 
                size='2x' 
                className='fa-button' 
                onClick={() => {
                  if(!newRoom || newRoom === 'newroom') {
                    alert( 
                      `The room type is invald. Select either Private or Group chat in the dropdown menu provided.`
                    );
                    return;
                  }
                  this.setState({
                    sideDrawerOpen: false,
                    topDrawerOpen: false,
                    createRoom: true,
                  });
                }}
              />
            </div>
            ) : null
          }
      </aside>
    )

    const rightBar = (
      <aside className='sidebar right-sidebar'>
          {
            (currentRoom && currentRoom.customData && !currentRoom.customData.isDirectMessage) ?
            (
              <div className='user-profile'>
                <p style={{margin: '0px'}}>Add to group</p>
                <button className='add-user' onClick={() => this.setState({
                  addToRoom: true
                })}>
                  Add User
                </button>
              </div>
            ) : null
          }
          { addToRoom ? (
            <div
              className='dialog-container' 
              style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
            >
              <AddToRoom 
                addToRoom={this.addToRoom}
              />
            </div>
          ) : null}
          {currentRoom ? (
            <RoomUsers 
              currentUser={currentUser}
              roomUsers = {roomUsers}
              sendDM={this.sendDM}
            />
          ) : null}
        </aside>
    )

    let backDrop;
    if(this.state.sideDrawerOpen || this.state.topDrawerOpen) {
      backDrop = <BackDrop clickHandler={this.backDropClickHandler}/>;
    }

    return(
      <div className='App'>
        {backDrop}
        <div className={sideDrawerOpen ? 'side-drawer open' : 'side-drawer'}>{leftBar}</div>
        <div className='show-bar'>{leftBar}</div>
        <section className='chat-screen'>
          { createRoom ? 
            (
              <div 
                className='dialog-container' 
                style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
              >
                <CreateRoomDialog 
                  isDirectMessage={newRoom === 'private' ? true : false}
                  createGroupRoom={this.createGroupRoom}
                  sendDM={this.sendDM}
                  setFalse={this.setFalse}
                />
              </div>
            ) : null
          }
          { showLogin ? 
            (
              <Dialog 
                userId={userId}
                handleInput={this.handleInput}
                connectToChatkit={this.connectToChatkit}
              />
            ) : null
          }
          <header className='chat-header'>
            <FontAwesomeIcon icon={faBars} 
              size='2x' style={{color: 'white'}}
              className='fa-button toggle'
              onClick={showLogin ? null : this.drawerClickHandler}
            />
            <div className='chat-heading' onClick={(showLogin || !currentRoom || currentRoom.customData.isDirectMessage || window.innerWidth > 700) ? null : this.headerClickHandler}>
              { currentRoom ? 
                <h3>{roomName}</h3> : 
                <h3>
                  Chit-Chat
                </h3> 
              }
            </div>
          </header>
          {
            currentRoom ? 
            <ul className='chat-messages'>
              <ChatSession messages={messages} user={currentUser} />
            </ul> : 
            <p className='welcome-message'>
              Welcome to Chit-Chat app, the easy way to keep in touch with
              friends. Click on the menu button and/or tap on a room to join.
              You can also create a room and add other user(s) to it. <br/>
              Tap on the room name to see room members and who is online.
              <br/> <br/>
              Happy chatting!
            </p>
          }
          <footer className='chat-footer'>
            <form className='message-form' onSubmit={this.sendMessage}>
              <input 
                type='text'
                name='newMessage'
                value={newMessage}
                onChange={(event) => {this.setState({
                  newMessage: event.target.value
                })}}
                className='message-input'
                placeholder='Type your message...'
              />
              <FontAwesomeIcon 
                style={{marginRight: '10px'}}
                icon={faPaperPlane}
                type='submit'
                size='2x'
                className='fa-button'
                onClick={this.sendMessage}
              />
            </form>
          </footer>
        </section>
        <div className='show-bar'>{rightBar}</div>
        { (currentRoom && currentRoom.customData.isDirectMessage) ?
          null : 
          <div className={topDrawerOpen ? 'top-drawer open' : 'top-drawer'}>
            {rightBar}
          </div> 
        }
      </div>
    );
  }
}

export default App;