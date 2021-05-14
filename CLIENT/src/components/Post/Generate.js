import React, {useState } from 'react'
import ReactDOM from 'react-dom'
import {useHistory} from 'react-router-dom'

const Generate = ()=>{
    const [number, setNumber] = useState("");
    const history = useHistory()


    const generatePost = ()=>{
        fetch('/posts/dummy/generate', {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                number
            })
        })
        .then(res=>res.json())
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
        
        
    }

    return(
        <div className="col-md-5 mx-auto">
            <form>
                 <p id="alert"></p>
                <div className="input-group">
                    <input value={number} onChange={(e)=>setNumber(e.target.value)} className="form-control" type="number" placeholder="Enter number of dummies" />              
                </div>

                <div className="input-group">
                    <button className="btn btn-success" onClick={()=>generatePost()}>Generate Posts</button>
                </div>
            </form>    
        </div>
    )
}


export default Generate