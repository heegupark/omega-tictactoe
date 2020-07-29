import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';
import Main from './main';

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Main />
        <Footer />
      </>
    );
  }
}

export default App;
