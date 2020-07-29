import React, { Component } from 'react';

class Menu extends Component {
  render() {
    const { time, player1, player2, turn } = this.props;
    return (
      <div className="menu-box position-absolute">
        <div className="row text-center menu mx-auto">
          <div className={`menu-item mx-1 col ${turn === player1 ? 'rounded gold' : ''}`}>{player1}</div>
          <div className="menu-item mx-1 col">{time}</div>
          <div className={`menu-item mx-1 col ${turn === player2 ? 'rounded gold' : ''}`}>{player2}</div>
        </div>
      </div>
    );
  }
}

export default Menu;
