import React from 'react';
import Proptypes from 'prop-types';

const Dialog = props => {
  const {userId, handleInput, connectToChatkit} = props;

  return(
    <div className='dialog-container'>
      <div className='dialog'>
        <form className='dialog-form' onSubmit={connectToChatkit}>
          <label className='username-label'>Login with your username</label>
          <input 
            id='username'
            className='username-input'
            autoFocus
            type='text'
            name='userId'
            value={userId}
            onChange={handleInput}
            placeholder='Enter your username'
          />
          <button type='submit' className='submit-btn'>Submit</button>
        </form>
      </div>
    </div>
  );
};

Dialog.propTypes = {
  userId: Proptypes.string.isRequired,
  handleInput: Proptypes.func.isRequired,
  connectToChatkit: Proptypes.func.isRequired,
};

class AddToRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    }
  }

  handleInput = e => {
    this.setState({
      input: e.target.value,
    });
  }

  addToRoom = (userId, event) => {
    event.preventDefault();
    this.props.addToRoom(userId);
  }

  render() {
    return(
      <div className='dialog'>
        <form className='dialog-form' 
          onSubmit={(e) => this.addToRoom(this.state.input, e)}
        >
          <div className='create-room'>
            <h5>Add new user to this room</h5>
            <label>Enter the user's ID:</label>
            <input 
              type='text'
              value={this.state.input}
              className='username-input'
              placeholder='Enter user ID'
              onChange={this.handleInput}
            />
            <button type='submit' className='submit-btn'>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

class CreateRoomDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      groupName: ''
    }

    this.handleInput = this.handleInput.bind(this);
    this.handleGroupInput = this.handleGroupInput.bind(this);
  }

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  handleGroupInput(e) {
    this.setState({groupName: e.target.value});
  }

  render() {
    const {input, groupName} = this.state;
    return(
      <div className='dialog'>
        <form className='dialog-form' 
          onSubmit={(e) => {
            e.preventDefault();
            this.props.isDirectMessage ? 
            this.props.sendDM(input) : 
            this.props.createGroupRoom(input, groupName)
          }}
        >
          { this.props.isDirectMessage ?
            <PrivateRoom 
              handleInput={this.handleInput}
              userId={this.state.userId}
              setFalse={this.props.setFalse}
            /> : 
            <GroupRoom 
              handleInput={this.handleInput}
              userId={this.state.userId}
              handleGroupInput={this.handleGroupInput}
              groupName={this.groupName}
              setFalse={this.props.setFalse}
            />
          }
        </form>
      </div>
    );
  }
}

const PrivateRoom = (props) => {
  return(
    <div className='create-room'>
      <h5>Create Private Chat</h5>
      <label>Enter the user's ID:</label>
      <input 
        type='text'
        value={props.userId}
        className='username-input'
        placeholder='Enter user ID'
        onChange={props.handleInput}
      />
      <div className='btn-container'>
        <button type='submit' className='submit-btn'>Submit</button>
        <button className='submit-btn' style={{color: 'red'}} onClick={
          props.setFalse
        }>Cancel</button>
      </div>
    </div>
  );
}

const GroupRoom = (props) => {
  return(
    <div className='create-room'>
      <h5>Create Group Room</h5>
      <label>Enter the room name:</label>
      <input
        className='username-input'
        type='text'
        value={props.groupName}
        placeholder='Enter group name'
        onChange={props.handleGroupInput}
      />
      <label>Enter group users' ID(s)</label>
      <input
        type='text'
        value={props.userId}
        className='username-input'
        placeholder='Separate multiple user IDs with comma "," '
        onChange={props.handleInput}
      />
      <div className='btn-container'>
        <button type='submit' className='submit-btn'>Submit</button>
        <button className='submit-btn' style={{color: 'red'}} onClick={
          props.setFalse
        }>CANCEL</button>
      </div>
    </div>
  );
}

export {Dialog, CreateRoomDialog, AddToRoom};