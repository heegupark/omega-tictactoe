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
    this.handlePlaySingle = this.handlePlaySingle.bind(this);
    this.handleMultiPlay = this.handleMultiPlay.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    const { room, user } = this.props;
    const roomId = room.id;
    socket.emit('join-room', { roomId, user });
    socket.on(`room-${roomId}`, data => {
      const playersArr = data.rooms.filter(room => {
        return room.roomId.toString() === roomId.toString();
      });
      if (data.success) {
        this.setState({
          success: data.success,
          players: playersArr[0].players
        });
      }
    });
    socket.on(`play-game-${roomId}`, data => {
      if (data.success) {
        this.props.setPlayers(this.state.players);
        this.props.playGame('multi');
      }
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
    // socket.emit('disconnect');
  }

  handleLeaveClick() {
    const { room, user } = this.props;
    const roomId = room.id;
    socket.emit('leave-room', { roomId, user });
    this.props.setView('waiting');
  }

  handleReadyClick() {
    const { room, user } = this.props;
    const roomId = room.id;
    socket.emit('game-ready', { roomId, user });
  }

  handlePlaySingle() {
    this.props.setPlayers(this.state.players);
    this.props.playGame('single');
  }

  handleMultiPlay() {
    const { room } = this.props;
    const roomId = room.id;
    socket.emit('play-game', { roomId });
  }

  handleRefreshClick() {
    const { room } = this.props;
    const roomId = room.id;
    socket.emit('refresh-room', { roomId });
  }

  render() {
    const { room } = this.props;
    const { success, players } = this.state;
    const { handleLeaveClick, handleReadyClick, handlePlaySingle, handleMultiPlay, handleRefreshClick } = this;
    const isNoOne = players.length === 0;
    const isSingle = players.length === 1;
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
                  const isMe = this.props.user === player.user;
                  return (
                    <tr key={index} className={`text-center h-40px ${isMe ? 'gold' : ''}`}>
                      <td>
                        {`${player.user} ${isMe ? '(me)' : ''}`}
                      </td>
                      <td className="ready-custom">
                        {isMe
                          ? player.ready
                            ? <button disabled className="btn-custom-no-border rounded">ready</button>
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
                : <tr className="text-center h-40px">
                  <td colSpan="2">
                  </td>
                </tr>
              }
              <tr className="text-center h-40px">
                <td colSpan="2">
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td colSpan="2">
                  {isNoOne
                    ? <button
                      className="btn-custom rounded"
                      onClick={handleRefreshClick}>refresh</button>
                    : isSingle
                      ? <button
                        className="btn-custom rounded"
                        onClick={handlePlaySingle}>play single</button>
                      : isAbleToStart
                        ? <button className='btn-custom rounded'
                          onClick={handleMultiPlay}>start</button>
                        : <button disabled className='btn-custom rounded'>
                          {'waiting'}
                        </button>
                  }
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td colSpan="2">
                  <button
                    className="btn-custom rounded"
                    onClick={handleLeaveClick}>leave</button>
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td colSpan="2">
                  <span className="font-small">
                    {isNoOne
                      ? ('* There is nothing above, please try again!')
                      : isAbleToStart
                        ? '* click to start the game.'
                        : '* all players should be ready for the game.'}
                  </span>
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
