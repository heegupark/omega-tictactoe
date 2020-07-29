import React, { Component } from 'react';
import Card from './card';
import Modal from './modal';

class Board extends Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      numOfCards: 9,
      isGameOver: false,
      winner: '',
      isPlayerTurn: true,
      checker: 'O'
    };
    this.setCards = this.setCards.bind(this);
    this.setWin = this.setWin.bind(this);
    this.setDraw = this.setDraw.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.clickCard = this.clickCard.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.handleReplayClick = this.handleReplayClick.bind(this);
    this.playComputer = this.playComputer.bind(this);
    this.changeChecker = this.changeChecker.bind(this);
  }

  componentDidMount() {
    this.setCards();
  }

  componentDidUpdate() {
    if (!this.state.isPlayerTurn) { this.playComputer(); }
  }

  playComputer() {
    // console.log(this.state.cards);
    const { cards } = this.state;
    const random = Math.random(0, 1) * 10;
    setTimeout(() => {
      for (let i = 0; i < cards.length; i++) {
        if (!cards[i].isClicked) {
          cards[i].player = 'computer';
          cards[i].isClicked = true;
          break;
        }
      }
    }, random);
    this.changePlayer();
  }

  changeChecker() {
    this.setState({
      checker: this.state.checker === 'O' ? 'X' : 'O'
    });
  }

  setCards() {
    const { numOfCards } = this.state;
    const array = [];
    for (let i = 0; i < numOfCards; i++) {
      array.push({
        id: i,
        player: undefined,
        isClicked: false,
        winCol: false
      });
    }
    this.setState({
      cards: array
    });
  }

  changePlayer() {
    this.setState({
      isPlayerTurn: !this.state.isPlayerTurn
    });
    this.props.changePlayer();
    this.props.setTime();
  }

  clickCard(id) {
    const { cards } = this.state;
    const { player } = this.props;
    cards[id] = { id, player, isClicked: true };
    this.setState({
      cards
    });
    this.checkWin();
  }

  setWin(winArray) {
    winArray.forEach(element => {
      return this.state.cards.map(card => {
        if (card.id === element) card.winCol = true;
      });
    });
    this.setState({
      isGameOver: true,
      winner: this.props.player
    });
    this.props.stop();
  }

  setDraw() {
    this.setState({
      isGameOver: true,
      winner: 'draw'
    });
    this.props.stop();
  }

  checkWin() {
    const { cards } = this.state;

    if (cards[0].player &&
        cards[4].player &&
        cards[8].player &&
        cards[0].player === cards[4].player &&
        cards[4].player === cards[8].player) {
      this.setWin([0, 4, 8]);
      return;
    }

    if (cards[2].player &&
        cards[4].player &&
        cards[6].player &&
        cards[2].player === cards[4].player &&
        cards[4].player === cards[6].player) {
      this.setWin([2, 4, 6]);
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (cards[i].player &&
          cards[i + 3].player &&
          cards[i + 6].player &&
          cards[i].player === cards[i + 3].player &&
          cards[i + 3].player === cards[i + 6].player) {
        this.setWin([i, i + 3, i + 6]);
        return;
      }
    }

    for (let i = 0; i <= 6; i = i + 3) {
      if (cards[i].player &&
        cards[i + 1].player &&
        cards[i + 2].player &&
        cards[i].player === cards[i + 1].player &&
        cards[i + 1].player === cards[i + 2].player) {
        this.setWin([i, i + 1, i + 2]);
        return;
      }
    }
    if (cards[0].player &&
      cards[1].player &&
      cards[2].player &&
      cards[3].player &&
      cards[4].player &&
      cards[5].player &&
      cards[6].player &&
      cards[7].player &&
      cards[8].player) {
      this.setDraw();
      return;
    }
    this.changePlayer();
  }

  handleReplayClick() {
    this.setState({
      isGameOver: false,
      winner: ''
    });
    this.props.play();
    this.setCards();
  }

  render() {
    const { clickCard, handleReplayClick } = this;
    const { time, isStarted, isPlaying, handleResume } = this.props;
    const { cards, isGameOver, winner, isPlayerTurn, checker } = this.state;
    return (
      <div className="board mx-auto">
        <div className="row grid-row mx-auto border-bottom">
          {cards.length
            ? [cards[0], cards[1], cards[2]].map(card => {
              return (
                <Card
                  key={card.id}
                  id={card.id}
                  card={card}
                  isPlayerTurn={isPlayerTurn}
                  checker={checker}
                  clickCard={clickCard}
                />
              );
            })
            : ''
          }
        </div>
        <div className="row grid-row mx-auto border-bottom">
          {cards.length
            ? [cards[3], cards[4], cards[5]].map(card => {
              return (
                <Card
                  key={card.id}
                  id={card.id}
                  card={card}
                  isPlayerTurn={isPlayerTurn}
                  checker={checker}
                  clickCard={clickCard}
                />
              );
            })
            : ''
          }
        </div>
        <div className="row grid-row mx-auto">
          {cards.length
            ? [cards[6], cards[7], cards[8]].map(card => {
              return (
                <Card
                  key={card.id}
                  id={card.id}
                  card={card}
                  isPlayerTurn={isPlayerTurn}
                  checker={checker}
                  clickCard={clickCard}
                />
              );
            })
            : ''
          }
        </div>
        {isGameOver
          ? <Modal
            category="win"
            handleReplayClick={handleReplayClick}
            winner={winner}
          />
          : isPlaying && isStarted
            ? ''
            : <Modal
              category="paused"
              handleResume={handleResume}
            />
        }
        {time
          ? ''
          : <Modal
            category="turnover"
          />
        }
      </div>
    );
  }
}

export default Board;
