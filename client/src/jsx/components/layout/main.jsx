import React from "react";

import Navbar from '../navbar/main.jsx';
import Tabs from '../tabs/main.jsx';

class MainLayout extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <Tabs />
      </div>
    );
  }
}

export default MainLayout;
