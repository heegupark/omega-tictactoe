import React, { Component } from 'react';
import Card from './card';
import Modal from './modal';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      numOfCards: 9,
      isGameOver: false,
      winner: ''
    };
    this.setCards = this.setCards.bind(this);
    this.setWin = this.setWin.bind(this);
    this.setDraw = this.setDraw.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.clickCard = this.clickCard.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.handleReplayClick = this.handleReplayClick.bind(this);
    this.playComputer = this.playComputer.bind(this);
    this.replay = this.replay.bind(this);
  }

  componentDidMount() {
    this.setCards();
    const { room } = this.props;
    socket.on(`click-card-${room.roomId}`, data => {
      this.setState({
        cards: data.cards
      });
    });
    socket.on(`change-player-${room.roomId}`, data => {
      this.changePlayer();
    });
    socket.on(`win-${room.roomId}`, data => {
      this.setWin(data.result);
    });
    socket.on(`draw-${room.roomId}`, data => {
      this.setDraw();
    });
    socket.on(`replay-${room.roomId}`, data => {
      this.replay();
    });
  }

  componentDidUpdate() {
    const { time } = this.props;
    this.props.startTimer();
    if (time === 0) {
      setTimeout(() => {
        this.props.setTime();
        this.changePlayer();
      }, 1000);
    }
  }

  playComputer() {
    const { cards } = this.state;
    const random = Math.random(0, 1) * 10;
    const arr = [...((add, set) => add(set, add))((set, add) => set.size < 9 ? add(set.add(Math.floor(Math.random() * 9)), add) : set, new Set())];
    setTimeout(() => {
      for (const i of arr) {
        if (!cards[i].isClicked) {
          cards[i].player = 'computer';
          cards[i].isClicked = true;
          break;
        }
      }
      this.checkWin();
      // this.changePlayer();
    }, random * 1000);
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
    const currentPlayer = this.props.turn;
    this.props.changePlayer();
    this.props.setTime();
    if (this.props.mode === 'single') {
      const nextPlayer = currentPlayer === this.props.user ? 'computer' : this.props.user;
      if (nextPlayer === 'computer') {
        this.playComputer();
      }
    }
  }

  clickCard(id) {
    const { cards } = this.state;
    const { turn, room } = this.props;
    cards[id] = { id, player: turn, isClicked: true };
    // this.setState({
    //   cards
    // });
    socket.emit('click-card', { roomId: room.roomId, cards });
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
      winner: this.props.turn
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
    const { room } = this.props;

    if (cards[0].player &&
        cards[4].player &&
        cards[8].player &&
        cards[0].player === cards[4].player &&
        cards[4].player === cards[8].player) {
      socket.emit('win', { roomId: room.roomId, result: [0, 4, 8] });
      // this.setWin([0, 4, 8]);
      return;
    }

    if (cards[2].player &&
        cards[4].player &&
        cards[6].player &&
        cards[2].player === cards[4].player &&
        cards[4].player === cards[6].player) {
      socket.emit('win', { roomId: room.roomId, result: [2, 4, 6] });
      // this.setWin([2, 4, 6]);
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (cards[i].player &&
          cards[i + 3].player &&
          cards[i + 6].player &&
          cards[i].player === cards[i + 3].player &&
          cards[i + 3].player === cards[i + 6].player) {
        socket.emit('win', { roomId: room.roomId, result: [i, i + 3, i + 6] });
        // this.setWin([i, i + 3, i + 6]);
        return;
      }
    }

    for (let i = 0; i <= 6; i = i + 3) {
      if (cards[i].player &&
        cards[i + 1].player &&
        cards[i + 2].player &&
        cards[i].player === cards[i + 1].player &&
        cards[i + 1].player === cards[i + 2].player) {
        socket.emit('win', { roomId: room.roomId, result: [i, i + 1, i + 2] });
        // this.setWin([i, i + 1, i + 2]);
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
      socket.emit('draw', { roomId: room.roomId });
      // this.setDraw();
      return;
    }
    // this.changePlayer();
    socket.emit('change-player', { roomId: room.roomId });
  }

  handleReplayClick() {
    const { room } = this.props;
    socket.emit('replay', { roomId: room.roomId });
  }

  replay() {
    this.setState({
      isGameOver: false,
      winner: ''
    });
    this.props.play();
    this.setCards();
  }

  render() {
    const { clickCard, handleReplayClick } = this;
    const { user, turn, player1, player2, time, isPaused, handleResume } = this.props;
    const { cards, isGameOver, winner } = this.state;
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
                  user={user}
                  turn={turn}
                  player1={player1}
                  player2={player2}
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
                  user={user}
                  turn={turn}
                  player1={player1}
                  player2={player2}
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
                  user={user}
                  turn={turn}
                  player1={player1}
                  player2={player2}
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
          : isPaused
            ? <Modal
              category="paused"
              handleResume={handleResume}
            />
            : ''
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
