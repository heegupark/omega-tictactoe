import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class Waiting extends Component {
  constructor() {
    super();
    this.state = {
      rooms: [],
      name: '',
      message: 'room name'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.roomIdRef = React.createRef();
  }

  componentDidMount() {
    socket.on('room-list', data => {
      this.setState({
        rooms: data.rooms
      });
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
    // socket.emit('disconnect');
  }

  handleChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      name: event.target.value
    });
  }

  showMessage(message, time) {
    const originalMsg = this.state.message;
    setTimeout(() => {
      this.setState({
        message: originalMsg
      });
    }, time);
    this.setState({
      message: 'enter room name'
    });
  }

  handleJoinClick() {
    const room = {
      id: this.roomIdRef.current.id.split(',')[0],
      name: this.roomIdRef.current.id.split(',')[1]
    };
    this.props.setView('room', room);
  }

  handleCreateClick() {
    const { name } = this.state;
    const random = Math.floor(Math.random() * 1000);
    const room = {
      id: uuidv4(),
      name: name ? name.trim() : `room-${random}`
    };
    socket.emit('create-room', room);
    this.setState({
      name: ''
    });
    this.props.setView('room', room);
  }

  handleRefreshClick() {
    socket.emit('refresh-room', null);
  }

  render() {
    const { handleChange, handleCreateClick, handleJoinClick, handleRefreshClick, roomIdRef } = this;
    const { rooms, name, message } = this.state;
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="text-center mb-2 gold">
              rooms
          </span >
          <table className="mx-auto mt-2 mb-1">
            <tbody>
              <tr className="text-center h-40px">
                <td colSpan="2"></td>
              </tr>
              {rooms.length
                ? (
                  rooms.map(room => {
                    const numOfPlayers = room.players.length;
                    return (
                      <tr
                        id={`${room.roomId},${room.name}`}
                        ref={roomIdRef}
                        key={room.roomId}
                        className="text-center h-40px">
                        <td>
                          {`${room.name} (${numOfPlayers})`}
                        </td>
                        <td>
                          {numOfPlayers > 1
                            ? <div>playing</div>
                            : <button
                              className="btn-custom-no-border rounded"
                              onClick={handleJoinClick}>join</button>
                          }
                        </td>
                      </tr>
                    );
                  })
                )
                : (
                  <tr className="text-center h-40px">
                    <td colSpan="2">{'no room'}</td>
                  </tr>
                )
              }
              <tr className="text-center h-40px">
                <td colSpan="2"></td>
              </tr>
              <tr className="text-center h-40px">
                <td>
                  <input
                    type="text"
                    className="input-custom rounded px-2"
                    placeholder={message}
                    value={name}
                    onChange={handleChange}/>
                </td>
                <td>
                  <button
                    className="btn-custom rounded"
                    onClick={handleCreateClick}>create</button>
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td colSpan="2"></td>
              </tr>
              <tr className="text-center h-40px">
                <td colSpan="2">
                  <button
                    className="btn-custom rounded"
                    onClick={handleRefreshClick}>refresh</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Waiting;
