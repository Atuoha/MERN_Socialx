import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
            <div>
                <footer className="text-center mt-5">
                    <p>let'sPoxt &copy; {new Date().getFullYear()} | Dev by <a href="https://bit.ly/atutechs">Atutechs Corp</a></p>
                </footer>
            </div>
        )
    }
}


export default Footer