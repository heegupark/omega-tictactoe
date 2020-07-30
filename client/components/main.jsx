import React, { Component } from 'react';
import Board from './board';
import User from './user';
import Waiting from './waiting';
import Room from './room';
import Menu from './menu';
import Play from './play';
import AutoStartModal from './auto-start-modal';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isStarted: false,
      isPlaying: false,
      isPaused: false,
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
    this.pause = this.pause.bind(this);
    this.setView = this.setView.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setPlayers = this.setPlayers.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.playGame = this.playGame.bind(this);
    this.resume = this.resume.bind(this);
  }

  componentDidMount() {
    const { room } = this.state;
    socket.on(`resume-${room.roomId}`, data => {
      this.resume();
    });
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
    const { room } = this.state;
    socket.emit('resume', { roomId: room.roomId });
  }

  resume() {
    this.setState({
      isPlaying: true,
      isPaused: false
    });
  }

  play() {
    this.setTime();
    this.setState({
      turn: this.state.player1,
      isPaused: false,
      isPlaying: true
    });
  }

  stop() {
    this.setState({
      isPlaying: false,
      isPaused: true,
      turn: ''
    });
    // this.stopTimer();
  }

  pause() {
    this.setState({
      isPlaying: false,
      isPaused: true
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
    const { handleStart, play, changePlayer, setTime, setView, playGame, setUser, startTimer, setPlayers, resetGame, handleResume, stop, pause } = this;
    const { time, isPaused, isStarted, user, player1, player2, turn, isPlaying, view, room, mode } = this.state;
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
              setTime={setTime}
              startTimer={startTimer}
              isPaused={isPaused}
              handleResume={handleResume}
              changePlayer={changePlayer}
              play={play}
            />
            <Play
              play={play}
              room={room}
              pause={pause}
              isPlaying={isPlaying}
            />
            {isStarted
              ? ''
              : <AutoStartModal
                handleStart={handleStart}
              />
              //   category="start"
              //   handleStart={handleStart}
              // />
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
            room={room}
            playGame={playGame}
            user={user}
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
