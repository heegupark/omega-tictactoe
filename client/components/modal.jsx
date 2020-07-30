import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const { category, winner } = this.props;
    const { handleReplayClick, handleBackToWaitingClick, handleStart, handleResume } = this.props;
    const msg = winner === 'draw' ? winner : `${winner} won!`;
    let element = null;
    switch (category) {
      case 'win':
        element = (
          <>
            <span className = "text-center mb-2">
              {msg}
            </span >
            <div className="row text-center">
              <div className="col mt-3 mb-2">
                <button
                  type="button"
                  className="bg-transparent rounded btn-custom"
                  onClick={handleReplayClick}>replay</button>
              </div>
            </div>
            <div className="row text-center">
              <div className="col mt-3 mb-2">
                <button
                  type="button"
                  className="bg-transparent rounded btn-custom"
                  onClick={handleBackToWaitingClick}>back</button>
              </div>
            </div>
          </>
        );
        break;
      case 'start':
        element = (
          <>
            <span className="text-center mb-2">
              Do you want to play?
            </span >
            <div className="row text-center">
              <div className="col mt-3 mb-2">
                <button
                  type="button"
                  className="bg-transparent rounded btn-custom"
                  onClick={handleStart}>start</button>
              </div>
            </div>
          </>
        );
        break;
      case 'paused':
        element = (
          <>
            <span className="text-center mb-2">
              Paused!
            </span >
            <div className="row text-center">
              <div className="col mt-3 mb-2">
                <button
                  type="button"
                  className="bg-transparent rounded btn-custom"
                  onClick={handleResume}>resume</button>
              </div>
            </div>
          </>
        );
        break;
      case 'turnover':
        element = (
          <>
            <span className="text-center mb-2">
              turn over
            </span>
          </>
        );
        break;
    }
    return (
      <div className="modal">
        <div className="modal-content">
          {element}
        </div>
      </div>
    );
  }
}

export default Modal;
