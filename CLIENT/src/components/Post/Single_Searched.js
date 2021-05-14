import React, { useState, useEffect, useContext } from 'react'
import {UserContext} from '../../App'
import ReactDOM  from 'react-dom'
import { useHistory } from 'react-router-dom'

const Single = ()=>{

    const [single_post, setSingle] = useState({})
    const {state, dispatch} = useContext(UserContext)
    const [comment_msg, setComment] = useState("");
    const history = useHistory();

    // Commenting
    const sendComment = (id)=>{
        fetch(`/posts/comment/${id}`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                comment_msg
            })
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.error){
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
                ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Comment sent successfully`
                ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                setTimeout(()=>{
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                    localStorage.removeItem('single');
                    localStorage.setItem('single', JSON.stringify(response))
                    let single = JSON.parse(localStorage.getItem('single'))
                    setSingle(single)
                    history.push('/single')
                }, 5000)
                let text = document.getElementById('text')
                ReactDOM.findDOMNode(text).value = ''
            }
        })
    }
    
    useEffect(()=>{
        let single = JSON.parse(localStorage.getItem('single_searched_post'))
        console.log(single)
        setSingle(single)
    }, [])
    

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
                localStorage.removeItem('single');
                localStorage.setItem('single', JSON.stringify(response))
                let single = JSON.parse(localStorage.getItem('single'))
                console.log(single)
                setSingle(single)
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
                localStorage.removeItem('single');
                localStorage.setItem('single', JSON.stringify(response))
                let single = JSON.parse(localStorage.getItem('single'))
                console.log(single)
                setSingle(single)
            }
        })
        .catch(err=>console.log(err))
    }


    const deletePost = (id)=>{
        console.log(id);
        fetch(`/posts/delete/${id}`, {
            method: "DELETE",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.error){

             let response_paragraph = document.getElementById('del_alert');
                ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${response.error}`
                ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-danger'
                setTimeout(()=>{
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                }, 5000)
            }else{
               
                let response_paragraph = document.getElementById('del_alert');
                ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${response.success}`
                ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                setTimeout(()=>{
                    ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                    history.push('/')
                }, 5000)
                
            }    
        })
    }


    const editPost = ()=>{
        history.push('/edit')
    }

        return (
            <div className="container">
                   <div className="col-md-10 mx-auto mt-2">
                            <img variant="top" alt="imagery" className="img-thumbnail" src="images/single_blog_1.png"/>
                            {/* <img variant="top" alt={single_post? single_post.title: ""} className="img-thumbnail" src={single_post? single_post.file: ""}/> */}


                        <div>
                        <p id="del_alert"></p>
                            <h1><b>{single_post? single_post.title: ""}</b></h1>
                            {/* {single_post.title? single_post.user._id: ""}  <br/>
                            {state? state.id: ""} */}
                            {single_post.title 
                            
                            ? 
                            
                                state.id == single_post.user._id 

                                ?
                                    <>
                                        <button onClick={()=> editPost()} className="btn btn-success mr-2">Edit Post <i className="fa fa-pencil"></i></button>

                                        <button onClick={()=> deletePost(single_post._id)} className="btn btn-danger">Delete Post <i className="fa fa-check-square"></i></button>
                                    </>  
                                :''  

                            :''
                
                            }
                         


                            {single_post.title ?
                                // single_post.likes.length > '0'?
                                <p>{single_post.likes.length} likes</p>
                                // : ''   
                            :
                            ''
                            }
                            

                            <p className="small"><i className="fa fa-user"></i> {single_post.title? single_post.user.name : ""}</p>

                            <p> 
                            {single_post? single_post.content: ""}     
                            </p> 

                            {/* Emotions count */}
                            {single_post.title?
                                single_post.likes.includes(state.id)?
                                <span><i onClick={()=>unlikePost(single_post.user._id, single_post._id)} className="fa fa-thumbs-o-down fa-2x unlikee"></i></span> 
                            :
                                <span><i onClick={()=>likePost(single_post.user._id, single_post._id)} className="fa fa-thumbs-o-up fa-2x likee"></i></span>
                            
                            :
                            ""

                            }
                           
                            
                        </div>

                        {/* PREVIEW COMMENT */}
                        <p className="p-top">Comments <i className="fa fa-envelope-open-o"></i></p>
                        {single_post.comments ?
                            single_post.comments.map(comment=>
                            <div className="media" style={{marginTop: "5px"}}>
                                <p className="pull-left" style={{marginRight:"10px"}}>
                                    <img class="media-object img-rounded" width="30" src="images/default.png"  alt="" />
                                </p>
                                <div className="media-body" style={{fontFamily: "monospace"}} >
                                    <h6 className="media-heading">  
                                        {comment.name}
                                    </h6>
                                <p>{comment.text}</p>
                                </div>
                            </div>
                            )

                        :
                        "" 
                        }
                         
                        {/*  */}

                            {/* Comment Section */}
                            <div>
                                <p id="alert"></p>
                                <p className="p-top">Leave a Comment</p>
                                <form method="post">
                                    {/* Hidden ID */}
                                    {/* <input type="hidden" value={single_post? single_post._id: ""} className="form-control" name="post_id"  placeholder="ID" />

                                    Display Name<br/>
                                    <input type="text" readOnly value={state? state.name: ""} className="form-control" name="comment_name" placeholder="Name" />
                                    Email<br/>
                                    <input type="Email" readOnly value={state? state.email: ""} className="form-control" name="comment_mail"  placeholder="Email" /> */}
                                    <textarea id="text" type="text" required onChange={(e)=> setComment(e.target.value)} className="form-control"  name="comment_msg" col="4" rows="3"  placeholder="Comment" >{comment_msg}</textarea>  <br/>

                                    <button onClick={()=> sendComment(single_post._id)} type="button"  class="btn btn-success">Comment <i className="fa fa-send"></i></button> 
                                </form>
                            </div>    

                        </div>
                    </div>
            // </div>
        )
}

export default Single