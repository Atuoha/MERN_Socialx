import React, { Component } from 'react'

class Captures extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    {this.props.posts.map(post=>
                        <div className="col-md-4">
                            {/* <img src="images/2.jpg" width="300" className="img-thumbnail" alt="imagery" /> */}
                            <img key={post._id} src={post.file} width="300" className="img-thumbnail" alt={post.title} />
                        </div>
                    )}

                </div>
            </div>
        )
    }
}

export default Captures