import React, { useState } from 'react';
import SignUp from "./page/SignUp"
import SignIn from "./page/SignIn"
import Dashboard from "./page/Dashboard"
import PageNotFound from "./page/PageNotFound"
import Header from "./layout/Header"
import { UserContext } from "./Context"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

const App = () => {
  const [user, setUser] = useState(null)
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Header />
        <Switch>

          <Route exact path="/SignUp" component={SignUp} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/Dashboard" component={Dashboard} />
          <Route component={PageNotFound} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;