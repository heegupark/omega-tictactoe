import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class Room extends Component {
  constructor() {
    super();
    this.state = {
      success: false,
      players: []
    };
    this.handleLeaveClick = this.handleLeaveClick.bind(this);
    this.handleReadyClick = this.handleReadyClick.bind(this);
    this.handlePlayAloneClick = this.handlePlayAloneClick.bind(this);
  }

  componentDidMount() {
    const { room, player } = this.props;
    const roomId = room.id;
    socket.emit('join-room', { roomId, player });
    socket.on('room', data => {
      const playersArr = data.rooms.filter(room => {
        return room.roomId.toString() === roomId.toString();
      });
      this.setState({
        success: data.success,
        players: playersArr[0].players
      });
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
    // socket.emit('disconnect');
  }

  handleLeaveClick() {
    const { room, player } = this.props;
    const roomId = room.id;
    socket.emit('leave-room', { roomId, player });
    this.props.setView('waiting');
  }

  handleReadyClick() {
    const { room, player } = this.props;
    const roomId = room.id;
    socket.emit('game-ready', { roomId, player });
  }

  handlePlayAloneClick() {
    this.props.playGame('single');
  }

  render() {
    const { room } = this.props;
    const { success, players } = this.state;
    const { handleLeaveClick, handleReadyClick, handlePlayAloneClick } = this;
    const isAllReady = players.filter(player => player.ready);
    const isAbleToStart = isAllReady.length === 2;
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="text-center mb-2 gold">
            {`${room.name}`}
          </span >
          <table className="mx-auto mt-2 mb-1">
            <tbody>
              <tr className="text-center h-40px">
                <td colSpan="2">
                </td>
              </tr>
              {success
                ? players.map((player, index) => {
                  const isMe = this.props.player === player.player;
                  return (
                    <tr key={index} className={`text-center h-40px ${isMe ? 'gold' : ''}`}>
                      <td>
                        {`${player.player} ${isMe ? '(me)' : ''}`}
                      </td>
                      <td>
                        {isMe
                          ? player.ready
                            ? <div>ready</div>
                            : <button
                              className="btn-custom rounded"
                              onClick={handleReadyClick}>ready</button>
                          : player.ready
                            ? <div>ready</div>
                            : <div>not ready</div>
                        }
                      </td>
                    </tr>
                  );
                })
                : <tr>
                  <td colSpan="2" className="text-center">
                    {'room is filled'}
                  </td>
                </tr>
              }
              <tr className="text-center h-40px">
                <td colSpan="2">
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td>
                  {success
                    ? isAbleToStart
                      ? <button
                        className='btn-custom rounded'
                        onClick={handleLeaveClick}>start</button>
                      : <button
                        className='btn-custom rounded'
                        onClick={handlePlayAloneClick}>play alone</button>
                    : ''}
                </td>
                <td>
                  <button
                    className="btn-custom rounded"
                    onClick={handleLeaveClick}>leave</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Room;
