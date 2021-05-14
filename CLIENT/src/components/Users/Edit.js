import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ReactDOM from 'react-dom'
import {UserContext} from '../../App'

const Edit = ()=>{

        const [name, setName] = useState("")
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [file, setFile] = useState("")
        const [user, setUser] = useState({})
        const {state, dispatch} = useContext(UserContext)

        const history = useHistory()


        useEffect(()=>{
            let profile =  JSON.parse(localStorage.getItem('user'))
            setUser(profile)
        }, [])

        const postData = (id)=>{
            alert(id)
            fetch(`/users/edit/${id}`, {
                method: "put",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password 
                })
            })
            .then(response=>response.json())
            .then(data=>{
                // console.log(data)
                if(data.error){
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${data.error}`
                    ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-danger'
                    setTimeout(()=>{
                        ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                    }, 5000)
                }else{
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Edit Successful <i className="fa fa-check-circle"><i>`
                    ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                    setTimeout(()=>{
                        localStorage.removeItem('userpost');
                        localStorage.setItem('userpost', JSON.stringify(data.posts))
                        localStorage.removeItem('user')
                        localStorage.setItem('user', JSON.stringify(data.user))
                        dispatch({type: "USER", payload:data.user})
                        history.push('/profile');
                    }, 5000)
                }

            })
            .catch(err=>console.log(`eRROR CAUSED DUE TO ${err}`))
            
            
        }

        const cancelEdit = ()=>{
            history.push('/profile')
        }

        return (
            <div className="container col-md-5 mx-auto">
                <h2 className="text-center">Editing Profile <i className="fa fa-check-circle"></i></h2>
                <form>
                    <p id="alert"></p>
                    <div className="form-group">
                        <label>Name <i className="fa fa-user"></i> {user? user.name: ""}</label>  
                        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="form-control" placeholder="Enter Fullname" required autoFocus />  
                    </div> 


                    <div className="form-group">
                        <label>Email <i className="fa fa-envelope"></i> {user? user.email: ""}</label>  
                        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" className="form-control" placeholder="Enter Email" required />  
                    </div>    

                    <div className="form-group">
                        <label>Password <i className="fa fa-key"></i>  xxxxxxxxxxxxxxxxxxxx</label>  
                        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter Password" required />  
                    </div> 


                    
                    <div className="form-group">
                        <label>Capture <img src="/images/default.png" width="20" alt="imagery" /></label>
                        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" name="capture" className="form-control" />
                    </div>

        
                    <div className="form-group">
                        <button type="button" className="btn btn-success mr-2" onClick={()=>postData(user._id)} >Submit Edit <i className="fa fa-check-square"></i></button>

                        <button type="button" className="btn btn-info " onClick={()=>cancelEdit()} >Cancel Edit <i className="fa fa-remove"></i></button>
                    </div> 
                </form> 
            </div>
        )
}


export default Edit