import React, { useState, useContext, } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ReactDOM from 'react-dom'
import  { UserContext }  from '../../App'

const Signin = ()=>{
    const {state, dispatch} = useContext(UserContext)
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory()
        
        const postData = ()=>{
            fetch("/logs/signin", {
                method: "post",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password 
                })
            })
            .then(response=>response.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${data.error}`
                    ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-danger'
                    setTimeout(()=>{
                        ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                    }, 5000)
                }else{
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.loggeduser))
                    dispatch({type: "USER", payload: data.loggeduser})
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Logged in as ${data.loggeduser.name} <i className="fa fa-check-circle"><i>`
                    ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                    setTimeout(()=>{
                        history.push('/');
                    }, 5000)
                }

            })
            .catch(err=>console.log(`eRROR CAUSED DUE TO ${err}`))
            
            
        }  
        return (
            <div className="container col-md-5 ">
                <h2 className="text-center">Sign in <i className="fa fa-user"></i> </h2>
                <form>
                    <p id="alert"></p>
                    <div className="form-group">
                        <label>Email <i className="fa fa-envelope"></i></label>  
                        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} className="form-control" placeholder="Enter Email" required autoFocus />  
                    </div>    

                    <div className="form-group">
                        <label>Password <i className="fa fa-key"></i></label>  
                        <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter Password" required />  
                    </div> 

                    <Link to="/signup" style={{color: "grey"}}>New here? Create Account</Link>
                    <Link to="/forgot" style={{color: "grey", float: "right"}}>Forgot Password?</Link><br/><br/>

                    <div className="form-group">
                        <button type="button" onClick={()=>postData()} className="btn btn-success btn-block">Sign in  <i className="fa fa-user"></i></button>
                    </div> 
                </form> 
            </div>
        )
}


export default Signin