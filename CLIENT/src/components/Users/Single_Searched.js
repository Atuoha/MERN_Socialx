import React, { useState, useEffect, useContext } from 'react'
import Captures from './Captures.js'
import Followers from './Followers.js'
import {UserContext} from '../../App'
import ReactDOM from 'react-dom'
import {useHistory} from 'react-router-dom'


// To access a parameter using react, make use of useParam from react-router-dom and deconstruct it the parameter on the url out from it
// E.g say we have https://localhost:7788/user/12334 and the parameter from the URL is user_id to obtain this use the importation of {useParams} from react-router-dom and assign the parameter in deconstructed form to it's function call. 
// import {useParam} from ''
// const {user_id} = useParam()
// console.log(user_id)




const Single = ()=>{
    const [pictures, setPicture] = useState([])
    const [single, setSingle] = useState([])
    const [users, setUsers]  = useState([])
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    useEffect(()=>{
        let single = JSON.parse(localStorage.getItem('single_searched_user'))
        console.log('single', single)
        setSingle(single)
        setPicture(single.posts)


        fetch('/users/all/limit', {
            method: "GET",
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            setUsers(response.users)
        })
        .catch(err=>console.log(err))


    }, [])


    const followUser = (id)=>{
        console.log(id)
        fetch(`/users/follow/${id}`,{
            method: "POST",
            headers:{
                "Authorization": "Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(response=>{
            let response_paragraph = document.getElementById('alert');
            ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
            ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Following successful`
            ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
            setTimeout(()=>{
                ReactDOM.findDOMNode(response_paragraph).style.display = 'none'    
                setSingle(response)
            }, 3000)

        })
        .catch(err=>console.log(err))
    }

    const UnfollowUser = (id)=>{
        console.log(id)
        fetch(`/users/unfollow/${id}`,{
            method: "POST",
            headers:{
                "Authorization": "Bearer "+ localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(response=>{
            let response_paragraph = document.getElementById('alert');
            ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
            ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Unfollow successful`
            ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
            setTimeout(()=>{
                ReactDOM.findDOMNode(response_paragraph).style.display = 'none'     
                setSingle(response)      
            }, 3000)

        })
        .catch(err=>console.log(err))
    }

    const editUser = ()=>{
        history.push('/useredit')
    }

        return (
            
            <div className="container">
              
                <div className="row col-md-10 mx-auto">
                    <div className="col-md-4">
                        <img src="images/default.png" alt="an imagery" width="250" className="rounded-circle img-thumbnail" />
                     </div>

                     <div className="col-md-8">
                        <h2>{single.user? single.user.name: ""}
                            {single.user
                            ?

                                state.id === single.user._id
                                ?
                                    <span><button type="button" onClick={()=> editUser()} className="btn ml-5">Edit Profile <i className="fa fa-gears"></i></button> </span>
                                :
                                ""
                                
                            :
                            ""
                            }
                            
                        </h2>
                           
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width:"50%"
                            }}>
                                    <p><b>{single.posts? single.posts.length: ""}</b> posts</p>
                                    <p><b>{single.user? single.user.followers.length: ""}</b> followers</p>
                                    <p><b>{single.user? single.user.following.length: ""}</b> following</p>
                            </div>
                            <div>
                                <p className="lead" style={{cursor: "pointer"}}>{single.user?single.user.email: ""}</p>

                                <p id="alert"></p>
                            </div>

                            {single.user 
                            ?
                                state.id !== single.user._id
                                ?
                                    single.user.followers.includes(state.id)
                                    ?
                                        <div><button onClick={()=> UnfollowUser(single.user._id)} class="btn btn-danger">Unfollow User <i className="fa fa-check-square"></i></button><br/></div>
                                    :
                                        <div><button onClick={()=> followUser(single.user._id)} class="btn btn-success">Follow User <i className="fa fa-check-square"></i></button><br/></div>

                                :
                                ""  
                            :
                            ""
                            }
                            

                             {/* Other Users */}
                                    <a href="/users" rel="noreferrer" style={{color: 'black', textDecoration: 'none'}}><b><i className="fa fa-group"></i> Other User's Profile</b></a>
                             {/*  */}
                     </div>   
                            
                  
                   {/* {single.user? single.user.followers: ""} */}
                            
                        {/* followers */}          
                        <Followers users={users}  />
                </div>
                        {/* Captures */}
                        <Captures posts={pictures? pictures : ""} />

                
            </div>
        )
}


export default Single