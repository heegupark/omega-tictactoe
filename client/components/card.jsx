import React, { Component } from 'react';

class Card extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clickCard(this.props.id);
  }

  render() {
    const { handleClick } = this;
    const { id, card, user, turn, player1 } = this.props;
    const isBorder = (id % 3 === 0 || id % 3 === 1);
    const isClicked = card ? card.isClicked : false;
    return (
      <div
        className={`py-auto thin col
              ${isBorder ? 'border-right' : ''} grid
              ${isClicked
                ? ''
                : user === turn
                  ? 'cursor'
                  : ''}`}
        onClick={
          isClicked
            ? null
            : user === turn
              ? handleClick
              : null
        }>
        <span className={`${card.winCol ? 'gold' : ''}`}>
          {isClicked
            ? card.player === player1 ? 'O' : 'X'
            : ''
          }
        </span>
      </div>
    );
  }
}

export default Card;
