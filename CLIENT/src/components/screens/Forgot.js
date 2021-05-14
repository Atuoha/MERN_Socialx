import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ReactDOM from 'react-dom'

const Forgot = ()=>{
    
    const [email, setEmail] = useState("");
    const history = useHistory()
        
        const postData = ()=>{
            fetch("/logs/forgot-password", {
                method: "post",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
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
                        history.push('/signin');
                    }, 5000)
                }else{
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a>${data.success} <i className="fa fa-check-circle"><i>`
                    ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                    setTimeout(()=>{
                        history.push('/signin');
                    }, 5000)
                }

            })
            .catch(err=>console.log(`eRROR CAUSED DUE TO ${err}`))
            
            
        }  
        return (
            <div className="container col-md-5 ">
                <h2 className="text-center">Forgot Password <i className="fa fa-key"></i> </h2>
                <form>
                    <p id="alert"></p>
                    <div className="form-group">
                        <label>Email <i className="fa fa-envelope"></i></label>  
                        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} className="form-control" placeholder="Enter Email" required autoFocus />  
                    </div>    

                    <Link to="/signin" style={{color: "grey"}}>Remembered Password? Signin</Link>

                    <div className="form-group">
                        <button type="button" onClick={()=>postData()} className="btn btn-success btn-block">Submit Request  <i className="fa fa-send"></i></button>
                    </div> 
                </form> 
            </div>
        )
}


export default Forgot