import React, {Component} from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Joke from "../Joke/Joke";
import { v4 as uuidv4 } from 'uuid';


class JokesList extends Component {
    static defaultProps = {
        numJokesToGet : 10
    }
    constructor(props){
        super(props);
        this.state = {
            jokes: [],
            activeNewJokesTab: "myJokes" 
        }
        //Bind Functions
        //this.handleVote = this.handleVote.bind(this)
    }

    /* ---------- API CALL ---------- */
    async componentDidMount (){
        // Current Jokes
        let currJokes = [];
        // The api call will be executed 10 times
        while(currJokes.length < this.props.numJokesToGet){
            //  Save the respone in a vairable
            let res = await axios.get("https://icanhazdadjoke.com", {
                headers:{ Accept: "application/json"}
            });
            // Pushing the objected response into the array, passing it id and vote
            currJokes.push({id: uuidv4() , joke: res.data.joke, votes:0}) 
        }
        // Set state
        this.setState({jokes: currJokes})
    }

    /* ---------- Functions ---------- */
    handleVote (id, delta){
        this.setState(
            st => ({
                jokes: st.jokes.map( j =>  
                    j.id === id ? {...j, votes: j.votes + delta } : j
                )
            })
        )
    }

    /* ---------- Render Component ---------- */
    render(){
        //const listJokes = null;
        return(
           
            <Container fluid="md" className="bg-light p-2 mt-5">
                <div className="d-flex justify-content-start align-items-center my-3 p-2">
                    <h2 className="me-4">App Joke</h2>
                    <Button variant="warning" className="ml-1">Get jokes</Button>
                </div>
                
                <div  className="bg-white p-2">
                    <Tabs
                    defaultActiveKey={this.state.activeNewJokesTab}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    >
                        <Tab eventKey="newJokes" title="New Jokes">
                        
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Clasification</th>
                                    <th>Jokes</th>
                                    <th>Raiting</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        //Pass as props the data to chield component
                                        this.state.jokes.map((j, idx) => ( 
                                            <Joke 
                                            key={idx} 
                                            vote={j.votes} 
                                            text={j.joke} 
                                            upVote={() => this.handleVote(j.id, 1)}
                                            downVote={() => this.handleVote(j.id, -1)}/>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Tab>
                    
                        <Tab eventKey="myJokes" title="My Jokes">
                            <h3>You didn't have jokes yet</h3>
                        </Tab>

                    </Tabs>
                </div>              
            </Container>
        )
    }
}

export default JokesList; 