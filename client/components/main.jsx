import React, { Component } from 'react';
import Board from './board';
import User from './user';
import Waiting from './waiting';
import Room from './room';
import Menu from './menu';
import AutoStartModal from './auto-start-modal';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isStarted: false,
      isPlaying: false,
      time: 10,
      room: {},
      view: 'user',
      mode: 'single',
      turn: '',
      user: '',
      player1: '',
      player2: ''
    };
    this.timer = null;
    this.setTime = this.setTime.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setView = this.setView.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setPlayers = this.setPlayers.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.playGame = this.playGame.bind(this);
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

  play() {
    this.setTime();
    this.setState({
      turn: this.state.player1,
      isPlaying: true
    });
  }

  stop() {
    this.setState({
      isPlaying: false,
      turn: ''
    });
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

  setUser(user) {
    this.setState({ user });
  }

  setPlayers(players) {
    if (players[0]) {
      this.setState({
        player1: players[0].user,
        player2: 'computer'
      });
    }
    if (players[1]) {
      this.setState({
        player2: players[1].user
      });
    }
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
      this.timer = setInterval(() => {
        this.countDown();
      }, 1000);
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
    const { turn, player1, player2 } = this.state;
    this.setState({
      turn: turn === player1 ? player2 : player1
    });
  }

  playGame(mode) {
    // if (mode === 'multi') {
    this.setState({ mode, turn: this.state.user });
    this.setView('game', this.state.room);
    // }
  }

  render() {
    const { handleStart, play, changePlayer, setTime, setView, playGame, setUser, startTimer, setPlayers, resetGame, stop } = this;
    const { time, isStarted, user, player1, player2, turn, view, room, mode } = this.state;
    let element = null;
    switch (view) {
      case 'game':
        element = (
          <>
            <Menu
              time={time}
              user={user}
              player1={player1}
              player2={player2}
              turn={turn}
              isStarted={isStarted}
            />
            <Board
              time={time}
              turn={turn}
              user={user}
              room={room}
              player1={player1}
              player2={player2}
              resetGame={resetGame}
              stop={stop}
              mode={mode}
              setView={setView}
              setTime={setTime}
              startTimer={startTimer}
              changePlayer={changePlayer}
              play={play}
            />
            {isStarted
              ? ''
              : <AutoStartModal
                handleStart={handleStart}
              />
            }
          </>
        );
        break;
      case 'user':
        element = (
          <User
            user={user}
            setUser={setUser}
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
            user={user}
            room={room}
            playGame={playGame}
            setPlayers={setPlayers}
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
