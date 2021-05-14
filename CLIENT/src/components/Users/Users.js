import React, {useState, useEffect, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import ReactDOM from 'react-dom'
import {Card} from 'react-bootstrap'
import {UserContext} from '../../App'

const Users = ()=>{

    const [number, setNumber] = useState("")
    const [search,setSearch] = useState("")
    const [users, setUsers]  = useState([])
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{

        fetch('/users/all', {
            method: "GET",
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            setUsers(response.users)
        })
        .catch(err=>console.log(err))

    },[])


    const genUsers = ()=>{
        console.log('pushing........')
        fetch('/users/dummy', {
            method: "POST", 
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                number
            })
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.error){
                console.log(response)
                let response_paragraph = document.getElementById('alert');
                   ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                   ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${response.error}`
                   ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-danger'
                   setTimeout(()=>{
                       ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                   }, 5000)

               }else{
                  
                   let response_paragraph = document.getElementById('alert');
                   ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                   ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> User dummies generated`
                   ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                   setTimeout(()=>{
                       ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                       history.push('/users')
                   }, 3000)
                   let text = document.getElementById('number');
                   ReactDOM.findDOMNode(text).value = ""
                   
            }
        })
        .catch(err=>console.log(err))

    }

    const singleUser = (id)=>{
        fetch(`/posts/user-posts/${id}`, {
            method: "GET"
        })
        .then(res=>res.json())
        .then(response=>{
            localStorage.removeItem('userpost')
            localStorage.setItem('userpost', JSON.stringify(response))
            history.push('/userposts')
        })
    }

    const DelUser = (id)=>{
        fetch(`/users/delete/${id}`, {
            method: "DELETE"
        })
        .then(res=>res.json())
        .then(response=>{
            let response_paragraph = document.getElementById('alert');
            ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
            ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Deleted User`
            ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
            setTimeout(()=>{
                ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                history.push('/users')
            }, 3000)
                   
        })
    }


    const search_User = ()=>{
            
        fetch('/users/search', {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                search
            })
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.users){
                localStorage.removeItem('multi_searched_users')
                localStorage.setItem('multi_searched_users', JSON.stringify(response.users))
                history.push('/multi_searched_users');
            }else if(response.user){
                localStorage.removeItem('single_searched_user')
                localStorage.setItem('single_searched_user', JSON.stringify(response))
                history.push('/single_searched_user');
            }else{
                let response_paragraph = document.getElementById('alert');
                ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${response.error}`
                ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-danger'
                setTimeout(()=>{
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                }, 5000)
            }
        })
        .catch(err=>console.log(err))
    }



    return(
        <div className="container">
                <div className="col-md-6  mx-auto">
                            <div className="form-group">
                                <div className="input-group dates-wrap">                                              
                                    <input value={number} id="number" onChange={(e)=> setNumber(e.target.value)} placeholder="Enter dummy number" autoFocus type="number" className="form-control"></input>

                                    <div className="input-group-prepend">
                                        <button type="button" onClick={()=>genUsers()} className="btn btn-success"><i className="fa fa-send"></i></button>
                                    </div>											
                                </div>
                            </div>
                </div>

                    <div className="col-md-6 mx-auto">
                                <p id="alert"></p>
                                <div className="form-group">
                                        <div className="input-group dates-wrap">                                              
                                            <input value={search} onChange={(e)=> setSearch(e.target.value)} className="dates form-control"  placeholder="Search User" type="text" />                        
                                            <div className="input-group-prepend">
                                                <button type="button" onClick={()=> search_User()} className="btn btn-success"><i className="fa fa-search"></i></button>
                                            </div>											
                                        </div>
                                </div>
                    </div>
            
            <p id="alert"></p>
            <div className="row">
                    { users.map(user=>
                        state.id !== user._id ?
                            <div key={user._id} className="col-md-4 mt-2">
                                <Card className="card_element" style={{paddingTop: "10px"}}>
                                    <Card.Img className="center-align text-center align-content-center" variant="top " src="images/default.png" style={{ width: '100px', margin: "0 auto" }}  />
                                    <Card.Body> 
                                        <Card.Title><i className="fa fa-user"></i> {user.name} <br/><b><i className="fa fa-envelope"></i> </b>{user.email}</Card.Title> 
                                        <p><i className="fa fa-check-square"></i> Followers: {user.followers.length} - Following: {user.following.length}</p>
                                        <p></p>
                                        


                                        <button className="btn btn-secondary mr-2" onClick={()=>singleUser(user._id)}>View User <i className="fa fa-caret-right"></i></button>

                                        <button className="btn btn-danger" onClick={()=>DelUser(user._id)}>Delete User <i className="fa fa-remove"></i></button>
                                        
                                    </Card.Body>
                                </Card>
                            </div>
                        : ""   
                    )}
                </div>

            
        </div>
    )

}

export default Users