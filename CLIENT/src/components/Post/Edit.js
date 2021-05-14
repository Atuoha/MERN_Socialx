import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import ReactDOM from 'react-dom'




 function Edit() {

    const [single_post, setSingle] = useState({})
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [file, setFile] = useState("")
    const history = useHistory()


    useEffect(()=>{
        const single = JSON.parse(localStorage.getItem('single'))
        setSingle(single)
    },[])

    const postData = (id)=>{
        console.log('submitting data')

        fetch(`/posts/update/${id}`, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                title,
                content
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
                    localStorage.removeItem('single');
                    localStorage.setItem('single', JSON.stringify(response))
                   let response_paragraph = document.getElementById('alert');
                   ReactDOM.findDOMNode(response_paragraph).style.display = 'block'
                   ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> Post has been updated`
                   ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                   setTimeout(()=>{
                       ReactDOM.findDOMNode(response_paragraph).style.display = 'none'
                       history.push('/single')
                   }, 5000)
               }   
        })
        .catch(err=>console.log(err))
    }


    return (
            <div className="col-md-5 mx-auto">
                <form>
                    <p id="alert"></p>

                    <div className="form-group">
                    <p><b>Current Post Title:</b><br/> {single_post.title}</p>
                        <label>Post Title</label>
                        <input autoFocus value={title} onChange={(e)=> setTitle(e.target.value)} type="text" name="title" className="form-control" />
                    </div>

                    <div className="form-group">
                      <p><b>Current Post Content:</b><br/> {single_post.content}</p>  
                        <label>Post Content</label>
                        <textarea value={content} onChange={(e)=> setContent(e.target.value)} type="text" name="content" className="form-control" col="3" rows="2" />
                    </div>

                    <div className="form-group">
                        <label>Post Capture</label>
                        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" name="capture" className="form-control" />
                    </div>

                    <div className="form-group">
                        <button type="button" onClick={()=>postData(single_post._id)} className="btn btn-success">Edit Post <i className="fa fa-check-square"></i></button>
                    </div>

                </form>
            </div>
    )
}


export default Edit