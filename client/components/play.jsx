import React, { Component } from 'react';

class Menu extends Component {
  constructor() {
    super();
    this.handlePauseClick = this.handlePauseClick.bind(this);
  }

  handlePauseClick() {
    this.props.stop();
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
