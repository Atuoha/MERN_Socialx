import React, {createContext, useReducer, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';
import Single from './components/Single';
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Create from './components/Post/Create'
import Searched_Posts from './components/Post/Searched'
import Single_Searched from './components/Post/Single_Searched'
import Edit from './components/Post/Edit'
import Users from './components/Users/Users'
import UserPosts from './components/Users/Single'
import Searched_Users from './components/Users/Searched'
import Single_Searched_User from './components/Users/Single_Searched'
import UserEdit from './components/Users/Edit'
import FollowPost from './components/FollowPost'
import Generate from './components/Post/Generate'
// import createBrowserHistory from 'history/createBrowserHistory';
import {reducer, initialState} from './reducers/userReducer'
import Forgot from './components/screens/Forgot';
import Reset from './components/screens/Reset';
export const UserContext = createContext('USER')



const Routing = ()=>{
  const history = useHistory()
  
  const {state, dispatch} = useContext(UserContext) 
  useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"))
      console.log(user)
      if(user){
        dispatch({type: "USER", payload:user})
        // history.push('/')
      }else{
        if(!history.location.pathname.startsWith('/forgot'))
        if(!history.location.pathname.startsWith('/reset'))
          history.push('/signin')
        
      }
  }, [])


  return(
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path="/signin" component={Signin} history={history}/>
          <Route path="/signup" component={Signup} history={history} />
          <Route path="/forgot" component={Forgot} history={history} />
          <Route path="/reset/:token" component={Reset} history={history} />
          <Route path="/profile" component={Profile} />
          <Route path="/single" component={Single} />
          <Route path="/single_searched_post" component={Single_Searched} />
          <Route path="/multi_searched_posts" component={Searched_Posts} />
          <Route path="/multi_searched_users" component={Searched_Users} />
          <Route path="/single_searched_user" component={Single_Searched_User} />
          <Route path="/users" component={Users} history={history} />
          <Route path="/userposts" component={UserPosts} history={history} />
          <Route path="/useredit" component={UserEdit} history={history} />
          <Route path="/following_posts" component={FollowPost} />
          <Route path="/dummy" component={Generate}  history={history} />
          <Route path="/create" component={Create} history={history} />
          <Route path="/edit" component={Edit} history={history} />
        </Switch>
  )
}

function App (){
  const [state, dispatch] = useReducer(reducer, initialState)
      return (
        <div className="App">
          <UserContext.Provider value={{state, dispatch}}>
            <Router>
              <Header />
              <Routing />       
              <Footer />    
            </Router>
          </UserContext.Provider> 

        </div>
      );
}


export default App;
