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
    const { id, card, isPlayerTurn, myChecker } = this.props;
    const isBorder = (id % 3 === 0 || id % 3 === 1);
    const isClicked = card ? card.isClicked : false;
    return (
      <div
        className={`py-auto thin col
              ${isBorder ? 'border-right' : ''} grid
              ${isClicked
                ? ''
                : isPlayerTurn
                  ? 'cursor'
                  : ''}`}
        onClick={
          isClicked
            ? null
            : isPlayerTurn
              ? handleClick
              : null
        }>
        <span className={`${card.winCol ? 'gold' : ''}`}>
          {isClicked
            ? myChecker
            : ''
          }
        </span>
      </div>
    );
  }
}

export default Card;
