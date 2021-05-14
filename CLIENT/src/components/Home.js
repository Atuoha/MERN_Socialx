import React, { useState, useEffect, useContext } from 'react'
import {Card} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import ReactDOM from 'react-dom'

const Body = ()=>{
    const [posts,setData] = useState([])
    const [search,setSearch] = useState("")
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
            fetch('/posts', {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                }
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


        const search_post = ()=>{
            
            fetch('/posts/search', {
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
                if(response.posts){
                    localStorage.removeItem('multi_searched_posts')
                    localStorage.setItem('multi_searched_posts', JSON.stringify(response.posts))
                    history.push('/multi_searched_posts');
                }else if(response.post){
                    localStorage.removeItem('single_searched_post')
                    localStorage.setItem('single_searched_post', JSON.stringify(response.post))
                    history.push('/single_searched_post');
                }else{
                    let response_paragraph = document.getElementById('alert');
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                    ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> No Post Found!`
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
                    <div className="col-md-6 mx-auto">
                        <form>
                            <p id="alert"></p>
                            <div className="form-group">
									<div className="input-group dates-wrap">                                              
										<input value={search} onChange={(e)=>setSearch(e.target.value)}  className="dates form-control"  placeholder="Search Post" type="text" />                        
										<div className="input-group-prepend">
											<button type="button" onClick={()=>search_post()} className="btn btn-success"><i className="fa fa-search"></i></button>
										</div>											
									</div>
							</div>
                        </form>    
                    </div>

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


export default Body