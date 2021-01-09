import React, { useEffect } from 'react'
import { Route, Switch, BrowserRouter,  } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Projects from './pages/Projects'
import NavBar from './components/NavBar'
import Background from './components/Background'
import ProjectView from './pages/ProjectView'
import Manage from './pages/Manage'
import './css/main.css'
import ChessPage from './pages/Chess'
import Login from './components/Login'
import { Flex } from '@chakra-ui/react'
import { createBrowserHistory } from 'history'
import ReactGA from 'react-ga'

const history = createBrowserHistory()
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('G-0W1Q4MZRW1')
  ReactGA.pageview(window.location.pathname + window.location.search)
  history.listen((location) => {
    ReactGA.pageview(location.pathname + location.search)
  })
}

export default function App () {
  useEffect(()=>{
    import('rust-wasm').then(x=> x.greet("oooooo"))
  },[])
  return (
    <div>
      <Background color='hsl(0, 0%, 96%)' />
      <BrowserRouter>
        <NavBar />
        <Flex flexDirection="column" alignItems="center">
          <Flex pt={ 2 } px={ 1 } w="100%" maxW="1200px" >
            <Switch>
              <Route path="/contact" component={ Contact } />
              <Route path="/projects/:pId" component={ ProjectView } />
              <Route path="/projects" component={ Projects } />
              <Route path="/chess" component={ ChessPage } />
              <Route path="/admin/login" component={ Login } />
              <Route path="/admin" component={ Manage } />
              <Route path="/" component={ Home } />
            </Switch>
          </Flex>
        </Flex>
      </BrowserRouter >
    </div>
  )
}
