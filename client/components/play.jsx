import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class Menu extends Component {
  constructor() {
    super();
    this.handlePauseClick = this.handlePauseClick.bind(this);
  }

  componentDidMount() {
    const { room } = this.props;
    socket.on(`pause-${room.roomId}`, data => {
      this.props.pause();
    });
  }

  handlePauseClick() {
    const { room } = this.props;
    socket.emit('pause', { roomId: room.roomId });
    // this.props.pause();
  }

  render() {
    const { isPlaying } = this.props;
    const { handlePauseClick } = this;
    return (
      <div className="row text-center position-absolute play-custom">
        <div className="col">
          <span className="mx-3">
            {isPlaying
              ? <i className="fas fa-pause cursor gold-hover" onClick={handlePauseClick}></i>
              : <i className="fas fa-play"></i>}
          </span>
        </div>
      </div>
    );
  }
}

export default Menu;
