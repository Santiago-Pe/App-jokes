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
        numJokesToGet : 10,
    }
    constructor(props){
        super(props);
        this.state = {
            jokes: [],
            jokesStorage: JSON.parse(window.localStorage.getItem("jokes")) || [],
            activeTab: "myJokes",
            loading: false
        }
        //Bind Functions
        this.handleClick = this.handleClick.bind(this);
        this.getJokes = this.getJokes.bind(this)
    }

    /* ---------- API CALL ---------- */
     componentDidMount (){
        this.setState({loading: true}, this.getJokes)
        
    }

    /* ---------- Functions ---------- */
    async getJokes () {
        try{
                this.setState({loading: true})
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
            this.setState(st => ({jokes: [... st.jokes, ...currJokes]}))
        }catch (err){
            alert(err)
        }finally{
            this.setState({loading: false})
        }
        
    }

    handleVote(id, delta) {
        this.setState((prevState) => ({
          jokes: prevState.jokes.map((j) =>
            j.id === id
              ? {
                  ...j,
                  votes: Math.max(0, Math.min(10, j.votes + delta)),
                }
              : j
          ),
        }));
    }

    handleClick () {
        // Cambio a mi ventana de chistes
        this.setState({activeTab: "newJokes"});
        // Traigo 10 chiste nuevos
        this.getJokes();
        
    }

    deletJoke (id) {
        // Obtener los datos almacenados en Local Storage
        const jokesStorage = JSON.parse(localStorage.getItem('jokes'));

        // Eliminar el chiste del array de chistes
        const updatedJokesStorage = jokesStorage.filter(joke => joke.id !== id);

        // Actualizar Local Storage con los nuevos datos
        localStorage.setItem('jokes', JSON.stringify(updatedJokesStorage));

        // Actualizar el estado con los nuevos datos
        this.setState({ jokesStorage: updatedJokesStorage });
        
    }

    saveJoke(id) {
        // Desestructuro mi estado
        const { jokes, jokesStorage } = this.state;

        // Capturo el chiste que deseo guardar
        const jokeToSave = jokes.find(j => j.id === id);
      
        // Pregunto si ya lo tengo en el estado

        if (jokesStorage.some(j => j.joke === jokeToSave.joke)) {
            alert("This joke is already saved!");
            return;
        }
        
        // Si no lo tengo porcedo a guardarlo en mi en una constante jutno con mis otros chistes almacenados
        const updatedJokesStorage = [...jokesStorage, jokeToSave];
        // Los guardo en mi local storages
        window.localStorage.setItem("jokes", JSON.stringify(updatedJokesStorage));
        
        // Y seteo el estado para poder mostrarlos
        this.setState({
          jokesStorage: updatedJokesStorage
        });

        console.log("Se guardo mi chiste")
    }
    /* ---------- Render Component ---------- */
    render(){
        const orderJokes = this.state.jokesStorage.sort((a, b) => b.votes - a.votes);
        return(
           
            <Container fluid="md" className="bg-light p-2 mt-5">
                <div className="d-flex justify-content-start align-items-center my-3 p-2">
                    <h2 className="me-4">App Joke</h2>
                    <Button variant="warning" className="ml-1" onClick={this.handleClick}>Get jokes</Button>
                </div>
                
                <div  className="bg-white p-2">
                    <Tabs
                    activeKey={this.state.activeTab}
                    onSelect={(tab) => this.setState({activeTab: tab})}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    
                    >
                        <Tab eventKey="newJokes" title="New Jokes" style={{ overflowY: "scroll", maxHeight: "520px" }}>
                            {   this.state.loading ?
                                <div className="d-flex justify-content-center p-3">
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                
                                :
                                <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Clasification</th>
                                    <th>Jokes</th>
                                    <th>Raiting</th>
                                    <th>Action</th>
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
                                            downVote={() => this.handleVote(j.id, -1)}
                                            saveJoke={() => this.saveJoke(j.id)}
                                            activeTab = {this.state.activeTab}    
                                            />
                                        ))
                                    }
                                </tbody>
                                </Table>
                            }

                        </Tab>
                    
                        <Tab eventKey="myJokes" title="My Jokes" style={{ overflowY: "scroll", maxHeight: "520px" }}>
                           
                           { 
                            orderJokes.length === 0 ?
                            <h3>You didn't have jokes yet</h3>
                            :
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Clasification</th>
                                    <th>Jokes</th>
                                    <th>Raiting</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        //Pass as props the data to chield component
                                        orderJokes.map((j, idx) => ( 
                                            <Joke 
                                            key={idx} 
                                            vote={j.votes} 
                                            text={j.joke} 
                                            upVote={() => this.handleVote(j.id, 1)}
                                            downVote={() => this.handleVote(j.id, -1)}
                                            deletJoke={() => this.deletJoke(j.id)}
                                            activeTab = {this.state.activeTab}    
                                            />
                                        ))
                                    }
                                </tbody>
                            </Table>
                           }
                        </Tab>
                    

                    </Tabs>
                </div>              
            </Container>
        )
    }
}

export default JokesList; 