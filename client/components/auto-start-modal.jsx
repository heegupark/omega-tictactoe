import React, { Component } from 'react';

class AutoStartModal extends Component {
  constructor() {
    super();
    this.state = {
      time: 3
    };
    this.timer = null;
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.countDown();
    }, 1000);
  }

  componentDidUpdate() {
    if (this.state.time === 0) {
      this.props.handleStart();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  countDown() {
    this.setState({
      time: this.state.time - 1
    });
  }

  render() {
    return (
      <div className="modal">
        <div className="text-center count-down-num">
          {this.state.time}
        </div>
      </div>
    );
  }
}

export default AutoStartModal;
