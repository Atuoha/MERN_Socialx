import React, { Component } from 'react'

class Followers extends Component {

    constructor(props){
        super(props)
        this.state = {
            user_id: JSON.parse(localStorage.getItem('user'))
        }
        this.singleUser = this.singleUser.bind(this)
    }


     singleUser(id){
        fetch(`/posts/user-posts/${id}`, {
            method: "GET"
        })
        .then(res=>res.json())
        .then(response=>{
            localStorage.removeItem('userpost')
            localStorage.setItem('userpost', JSON.stringify(response))
            window.location.replace('/userposts')
        })
    }

    render() {

        return (
            <div className="mt-4">
                <hr style={{border: "1px inset #ededed"}} />
                Few Other Users


                <div className="row">
                    {this.props.users.map(user=>
                        user._id !== this.state.user_id.id    
                        ?
                            <div key={user._id} className="col-md-2 col-sm-3 mr- text-center" style={{cursor: "pointer"}} onClick={()=>this.singleUser(user._id)}>
                            <img src="images/default.png" alt="imagery" className="rounded-circle img-thumbnail" width="100" />
                            {/* <img src={user.file} alt="imagery" className="rounded-circle img-thumbnail" width="100" /> */}          
                            <p className="text-center" >{user.name}</p>
                            </div>
                        :
                        ""
                        
 
                    )}
                    
                </div>
            </div>
        )
    }
}

export default Followers