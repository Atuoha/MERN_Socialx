import React, { useState, useEffect, useContext } from 'react'
import Captures from './Captures'
import Followers from './Followers'
import  { UserContext }  from '../../App'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Profile = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const [pictures, setPicture] = useState([])
    const [users, setUsers]  = useState([])
    const [user, setUser] = useState("")
    const history = useHistory()

    useEffect(()=>{
        fetch(`/posts/my-posts`, {
            method: "Get",
            headers:{
                "Authorization":"Bearer " + localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.posts)
            console.log(state)
            setPicture(data.posts)
            setUser(data.user)
        })
        .catch(err=>console.log(err))


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

    const editUser = ()=>{
        history.push('/useredit')
    }


    const followingPost = ()=>{
        history.push('/following_posts')
    }

        return (
            <div className="container">
                <div className="row col-md-10 mx-auto">
                    <div className="col-md-4">
                        <img src="images/text1.jpg" alt="an imagery" width="250" className="rounded-circle img-thumbnail" />
                     </div>

                     <div className="col-md-8">
                            <h2> {state?state.name: ""}  <button onClick={()=> editUser()} className="btn ml-5">Edit Profile</button> <i className="fa fa-gears"></i></h2>
                            <div 
                            > 
                                {user
                                ?       <i>
                                        <i className="mr-2"><b>{pictures.length}</b> posts</i>
                                        <i className="mr-2"><b>{user.followers.length}</b> followers</i>
                                        <i><b>{user.following.length}</b> following</i>
                                        </i>
                                :
                                ""
                                }
                                   
                            </div>
                            <div>
                                <p className="lead" style={{cursor: "pointer"}}>{state?state.email: ""}</p>
                                <p onClick={()=> followingPost()}  style={{cursor: "pointer"}}>View Posts of People you follow <i className="fa fa-eye"></i></p>
                            </div>

                             {/* Other Users */}
                                    <a href="/users" rel="noreferrer" style={{color: 'black', textDecoration: 'none'}}><b><i className="fa fa-group"></i> Other User's Profile</b></a>
                             {/*  */}
                     </div>   
                            
                   
                            
                        {/* followers */}          
                        <Followers users={users} />
                </div>
                        {/* Captures */}
                        <Captures posts={pictures} />

                
            </div>
        )
}


export default Profile