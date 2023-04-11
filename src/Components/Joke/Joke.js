import React, {Component} from "react";
import { PlusLg, DashLg, EmojiFrown } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';

class Joke extends Component {
    constructor(props){
        super(props)
    }
    render(){
        // Destructuring props
        const {vote, text, upVote, downVote} = this.props
        return(
            <tr>
                <td>
                    <div className="d-flex justify-content-around aling-items-center">
                        <Button variant="outline-dark" size="sm" onClick={upVote}>    
                            <PlusLg/>
                        </Button>
                            {vote}
                        <Button variant="outline-dark" size="sm" onClick={downVote}>
                            <DashLg/>
                        </Button>   
                    </div> 
                </td>
                <td>{text}</td>
                <td>
                    <EmojiFrown/>
                </td>
            </tr>
        )
    }
}

export default Joke