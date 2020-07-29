import React, { Component } from 'react';

class Player extends Component {
  constructor() {
    super();
    this.state = {
      player: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateUsername = this.handleCreateUsername.bind(this);
  }

  handleChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      player: event.target.value
    });
  }

  handleCreateUsername() {
    const { player } = this.state;
    const random = Math.floor(Math.random() * 1000);
    this.props.setPlayer(player || `player#${random}`);
    this.props.setView('waiting');
  }

  render() {
    const { handleChange, handleCreateUsername } = this;
    const { player } = this.state;
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="text-center mb-2 gold">
            {'type player name'}
          </span >
          <table className="mx-auto mt-2 mb-1">
            <tbody>
              <tr className="text-center h-40px">
                <td></td>
              </tr>
              <tr className="text-center h-40px">
                <td>
                  <input
                    type="text"
                    className="input-custom rounded px-2 text-center"
                    placeholder={'type username'}
                    value={player}
                    onChange={handleChange} />
                </td>
              </tr>
              <tr className="text-center h-40px">
                <td></td>
              </tr>
              <tr className="text-center h-40px">
                <td>
                  <button
                    className="btn-custom-no-border rounded"
                    onClick={handleCreateUsername}>create</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Player;
