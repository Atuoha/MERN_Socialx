import React, { useContext } from 'react'
import { Navbar, Nav} from 'react-bootstrap';
import {NavLink, useHistory} from 'react-router-dom'
import {UserContext} from '../App'


const  Header = ()=>{

    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    const logout = ()=>{
        localStorage.clear()
        localStorage.removeItem('jwt');
        dispatch({type: "CLEAR"})
        history.push('/signin')

    }

    const rendeList = ()=>{
        if(state){
            return [
                <NavLink key="1" className="link" to="/create">Create</NavLink>,
                // <NavLink key="2" className="link" to="/dummy">Dummy</NavLink>,
                <NavLink key="3" className="link" to="/profile">Profile</NavLink>,
                <NavLink key="4"  className="link" to="/signin" onClick={()=>logout()}>Logout <i className="fa fa-sign-out"></i></NavLink>

            ]
        }else{
            return [
                <NavLink key="5"  className="link" to="/signin">Signin <i className="fa fa-sign-in"></i></NavLink>
            ]
            
        }
    }

        return (
            <div>
               <Navbar bg="secondary" variant="dark">
                    <Navbar.Brand><NavLink exact className="link" to={state? "/" : "/signin"}>Let'sPoxt</NavLink></Navbar.Brand>
                    <Nav className="">
                    {/* <Nav.Link><NavLink exact to="/" activeClassName="activeNav" className="link">Home</NavLink></Nav.Link> */}
                        {rendeList()}

                    </Nav>           
                </Navbar>
                

                <div className="jumbotron bg-secondary text-white text-center">
                    <h1><strong>Let'sPoxt <i className="fa fa-check-circle"></i></strong></h1>
                    <p className="small-text">Sharing ideas and moments bigger than ourselves with notations of a brighter view </p>
                </div>
            </div>
        )
    }

export default Header

