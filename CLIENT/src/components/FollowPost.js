import React, { useState, useEffect, useContext } from 'react'
import {Card} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const FellowPost = ()=>{
    const [posts,setData] = useState([])
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
            fetch('/posts/following_posts', {
                method: "GET",
            })
            .then(response=>response.json())
            .then(result=>{
                console.log(result)
                setData(result.posts)
            })
            .catch(err=>console.log(err))
    }, [])

    
        const singlePost = (post)=>{
            console.log(post)
            fetch(`/posts/show/${post}`,{
                method: "Get"
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result.post)
                localStorage.removeItem('single');
                localStorage.setItem('single', JSON.stringify(result.post))
                history.push('/single')
            })
            .catch(err=>console.log(err))
        }




        const likePost = (user, postId)=>{
            console.log(user, postId)

            fetch(`/posts/like`, {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":"Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    postId
                })

            })
            .then(res=>res.json())
            .then(response=>{
                if(response.error){
                    console.log(response.error)
                }else{
                    console.log(response)
                    const newData =  posts.map(item=>{
                        if(item._id == response._id){
                            return response
                        }else{
                            return item
                        }
                    }) 
                    setData(newData)   
                }
            })
            .catch(err=>console.log(err))

        }


        const unlikePost = (user, postId)=>{
            console.log(user, postId)

            
            fetch(`/posts/unlike`, {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":"Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    postId
                })

            })
            .then(res=>res.json())
            .then(response=>{
                if(response.error){
                    console.log(response.error)
                }else{
                    console.log(response)
                    const newData =  posts.map(item=>{
                        if(item._id == response._id){
                            return response
                        }else{
                            return item
                        }
                    }) 
                    setData(newData)  
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

        return(
            <div className="container">
                <div className="row">
                    { posts.map(post=>
                        <div key={post._id} className="col-md-4 mt-2">
                            <Card className="card_element">
                                <Card.Img variant="top " src="images/single_blog_2.png" style={{ maxHeight: '250px', minHeight: '210px' }}  />
                                <Card.Body> 
                                    <Card.Title>{post.title}</Card.Title>
                                        {/* {post.likes.length > '0'? */}
                                            <p>{post.likes.length} likes | {post.comments.length} Comments</p>
                                            {/* : ''  
                                        }  */}
                                    <Card.Text>
                                        <p style={{cursor: "pointer"}}  onClick={()=>singleUser(post.user._id)}><i className="fa fa-user"></i> {post.user.name}</p>
                                    <p>{post.content}</p>
                                    {/* Emotions count */}


                                    {post.likes.includes(state.id)?
                                        <span><i onClick={()=>unlikePost(post.user._id, post._id)} className="fa fa-thumbs-o-down fa-2x unlikee"></i></span> 
                                    :
                                        <span><i onClick={()=>likePost(post.user._id, post._id)} className="fa fa-thumbs-o-up fa-2x likee"></i></span>

                                    }
                                        
                                    </Card.Text>
                                    <button className="btn btn-secondary" onClick={()=>singlePost(post._id)}>View More <i className="fa fa-caret-right"></i></button>

                                    {/* <Link className="btn btn-secondary" to={'single/'+post._id} rel="noreferrer" target="_blank">View More <i className="fa fa-caret-right"></i></Link> */}
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        )
    
}


export default FellowPost