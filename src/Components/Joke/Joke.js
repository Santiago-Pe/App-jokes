import React, {Component} from "react";
import { PlusLg, DashLg, EmojiFrown,BoxArrowDown, Trash3 } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';

class Joke extends Component {

    static defaultProps = {
        tabNewJokes: "newJokes",
        tabMyJokes: "myJokes"
    }
    constructor(props){
        super(props)
    }
    render(){
        // Destructuring props
        const {vote, text, upVote, downVote, saveJoke, activeTab, deletJoke, tabNewJokes, tabMyJokes} = this.props;
        
        return(
            <tr>
                <td>
                    <div className="d-flex justify-content-around aling-items-center">
                            {
                                activeTab === tabNewJokes && 
                                <Button variant="outline-dark" size="sm" onClick={upVote}>    
                                    <PlusLg/>
                                </Button>
                            }
                            {vote}
                            {
                                activeTab === tabNewJokes &&
                                <Button variant="outline-dark" size="sm" onClick={downVote}>
                                    <DashLg/>
                                </Button>   
                            }
                    </div> 
                </td>
                <td>{text}</td>
                <td>
                    <div className="d-flex justify-content-center aling-items-center">
                        <EmojiFrown/>
                    </div>
                </td>
                <td>
                    <div className="d-flex justify-content-center aling-items-center">
                        {activeTab === tabMyJokes ?
                        <Button variant="outline-dark" size="sm" onClick={deletJoke} >
                            <Trash3 />
                        </Button>
                        :
                       
                        <Button variant="outline-dark" size="sm" onClick={saveJoke} >
                            <BoxArrowDown />
                        </Button>
                        }
                    </div>
                </td>
            </tr>
        )
    }
}

export default Joke