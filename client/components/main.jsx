import React, { Component } from 'react';
import Board from './board';
import Player from './player';
import Waiting from './waiting';
import Room from './room';
import Menu from './menu';
import Play from './play';
import Modal from './modal';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isStarted: false,
      isPlaying: false,
      time: 10,
      room: {},
      view: 'player',
      mode: 'single',
      player: '',
      player1: '',
      player2: 'computer'
    };
    this.timer = null;
    this.setTime = this.setTime.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setView = this.setView.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.playGame = this.playGame.bind(this);
  }

  componentDidUpdate() {
    this.startTimer();
    const { time } = this.state;
    if (time <= 0) {
      setTimeout(() => {
        this.setTime();
        this.changePlayer();
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleStart() {
    this.setState({
      isStarted: true
    });
    this.play();
  }

  handleResume() {
    this.setState({
      isPlaying: true
    });
  }

  play() {
    this.setTime();
    this.setState({
      isPlaying: true
    });
  }

  stop() {
    this.setState({
      isPlaying: false
    });
    // this.stopTimer();
  }

  setTime() {
    this.stopTimer();
    this.setState({
      time: 10
    });
  }

  setView(view, room) {
    this.setState({
      view,
      room
    });
  }

  setPlayer(player) {
    this.setState({ player, player1: player });
  }

  countDown() {
    this.setState({
      time: this.state.time - 1
    });
  }

  startTimer() {
    const { isPlaying } = this.state;
    this.stopTimer();
    if (isPlaying) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      this.stopTimer();
    }
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  resetGame() {
    this.setState({
      isStarted: false
    });
    this.setTime();
  }

  changePlayer() {
    this.setState({
      turn: this.state.turnm === this.state.player1 ? this.state.player2 : this.state.player1
    });
  }

  playGame(mode) {
    if (mode === 'single') {
      this.setState({ mode });
      this.setView('game');
    }
  }

  render() {
    const { handleStart, play, changePlayer, setTime, setView, playGame, setPlayer, resetGame, handleResume, stop } = this;
    const { time, isStarted, player, player1, player2, turn, isPlaying, view, room, mode } = this.state;
    let element = null;
    switch (view) {
      case 'game':
        element = (
          <>
            <Menu
              time={time}
              player1={player1}
              player2={player2}
              turn={turn}
              isStarted={isStarted}
            />
            <Board
              time={time}
              player={player}
              player1={player1}
              player2={player2}
              resetGame={resetGame}
              stop={stop}
              mode={mode}
              setTime={setTime}
              isStarted={isStarted}
              isPlaying={isPlaying}
              handleResume={handleResume}
              changePlayer={changePlayer}
              play={play}
            />
            <Play
              play={play}
              stop={stop}
              isPlaying={isPlaying}
            />
            {isStarted
              ? ''
              : <Modal
                category="start"
                handleStart={handleStart}
              />
            }
          </>
        );
        break;
      case 'player':
        element = (
          <Player
            player={player}
            setPlayer={setPlayer}
            setView={setView}
          />
        );
        break;
      case 'waiting':
        element = (
          <Waiting
            setView={setView}
          />
        );
        break;
      case 'room':
        element = (
          <Room
            room={room}
            playGame={playGame}
            player={player}
            setView={setView}
          />
        );
        break;
    }
    return (
      <main className="d-flex align-items-center">
        {element}
      </main>
    );
  }
}

export default Main;
