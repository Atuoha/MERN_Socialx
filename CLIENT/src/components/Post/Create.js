import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {useHistory} from 'react-router-dom'

const Create = ()=>{
        const [title, setTitle] = useState("")
        const [content, setContent] = useState("")
        const [upload_file, setFile] = useState("")
        const [file, setImage] = useState("")
        const history = useHistory()

        useEffect(()=>{
            if(file){
                // creating post
                fetch('/posts/create', {
                    method: "post",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        file
                    })
                })
                .then(response=>response.json())
                .then(data=>{
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
                        ReactDOM.findDOMNode(response_paragraph).innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close" >&times;</a> ${data.success} <i className="fa fa-check-circle"><i>`
                        ReactDOM.findDOMNode(response_paragraph).className = 'alert alert-success'
                        setTimeout(()=>{
                            history.push('/');
                        }, 5000)
                    }
                })
                .catch(err=>console.log(err))
            }
        }          
        ,[file])

        const CLOUDINARY_UPLOAD_PRESET = 'b3pggsfv'
        const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/atutechs/image/upload' //From base URL
        const postData = ()=>{
            const formData = new FormData()
            formData.append('file', upload_file)
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            formData.append('cloud_name', 'atutechs')

            // uploading image to cloudinary
            fetch(CLOUDINARY_UPLOAD_URL, {
                method: "post",
                body: formData
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setImage(data.url)
            })
            .catch(err=>console.log(err))   
            
        }

        return(
            <div className="col-md-5 mx-auto">
                <form>
                    <p id="alert"></p>

                    <div className="form-group">
                        <label>Post Title</label>
                        <input value={title} onChange={(e)=> setTitle(e.target.value)} type="text" name="title" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Post Content</label>
                        <textarea value={content} onChange={(e)=> setContent(e.target.value)} type="text" name="content" className="form-control" col="3" rows="2" />
                    </div>

                    <div className="form-group">
                        <label>Post Capture</label>
                        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" name="capture" className="form-control" />
                    </div>

                    <div className="form-group">
                        <button type="button" onClick={()=>postData()} className="btn btn-success">Create Post <i className="fa fa-send"></i></button>
                    </div>

                    <a href="/dummy" rel="noreferrer">Generate Dummy Posts</a>
                </form>
            </div>
        )
}

export default Create