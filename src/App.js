import React from 'react';
import { Controls } from './Controls';
import { NoiseField } from './NoiseField';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ControlSettings from './ControlSettings';
import SvgDisplay from './SvgDisplay';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// Import firebase and StyledFirebaseAuth
import firebase from "firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// Configure Firebase (get configuration from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBa2HVSpn5eJhzlBkLWr3wLeR5hE10_-PE",
    authDomain: "info-340-problem-set-9.firebaseapp.com",
    databaseURL: "https://info-340-problem-set-9.firebaseio.com",
    projectId: "info-340-problem-set-9",
    storageBucket: "info-340-problem-set-9.appspot.com",
    messagingSenderId: "736700053520",
    appId: "1:736700053520:web:21d6a0ad32294320133295",
    measurementId: "G-03M2VKQ7M2"
};

// Initialize your application with the given configuration
firebase.initializeApp(firebaseConfig);

// Set UI config for sign in (see: https://github.com/firebase/firebaseui-web-react)
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
};

const height = 600;
const width = 900;

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num_lines: ControlSettings.num_lines.value,
            noiseScale: ControlSettings.noiseScale.value,
            seed: 1,
            max_steps: ControlSettings.max_steps.value,
            stepLength: ControlSettings.stepLength.value,
            lineColor: "#FF0000",
            backgroundColor: "#000000",
            isSignedIn: false, // Local signed-in state.
        }

        // Store references to 'favories' and 'public'
        
        // When the value at the public reference changes, change the state of "public" to be the value stored at that reference
        
        // Bind "this" to "this.like (function written below"
    }

    // Method for updating state
    handleChange(value, key) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    // See: https://github.com/firebase/firebaseui-web-react#using-firebaseauth-with-local-state
    componentDidMount() {
        // Store the AuthObserver (so you can unauthorize the application)
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
        // Set the state of `isSignedIn`

        // Make a reference to this particular user in the `favorites/` reference

        // When the value at the "favorites/user.uid" reference changes, 
        // change the state of "favorites" to be the value stored at that reference
    }
    
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    // Function to save an svg file
    save() {
        const s = new XMLSerializer();
        const svgStr = s.serializeToString(document.querySelector("svg"));
        // Make a reference to this particular user in the `favorites/` reference
        // Hint: user firebase.auth().currentUser.uid
        // Push in a  new data object to the reference, including:
        // - svg: the `svgStr` variable created above
        // - time: use the timestamp when the data arrives at the databse 
    }

    share() {
        const s = new XMLSerializer();
        const svgStr = s.serializeToString(document.querySelector("svg"));                
        // Push in a  new data object to the public reference, including:
        // - svg: the `svgStr` variable created above
        // - time: use the timestamp when the data arrives at the databse 
        // - likes: 0       
    }

    // Write a function to like a particular element
    like(svgId) {
        // Make a reference to the /likes element for the particular svg

        // Issue a transaction to increment the value        
    }
    render() {
        // If the state is not currently signed in, return a simple sign in screen
        // See: https://github.com/firebase/firebaseui-web-react#using-styledfirebaseauth-with-a-redirect       
        if (!this.state.isSignedIn) {
            return (
              <div>
                <h1>My App</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
              </div>
            );
          }        
        
        return (
            <Router>
                <div>
                    <AppBar>
                        <nav>
                            <Button><Link style={{ textDecoration: 'none', color:"white"}} to="/">Build</Link></Button>
                            <Button><Link style={{ textDecoration: 'none', color:"white"}} to="/favorites">My Favorites</Link></Button>
                            <Button><Link style={{ textDecoration: 'none', color:"white"}} to="/shared">Shared</Link></Button>
                            {/* Add an onClick event to signOut of the application*/}                            
                            <Button onClick = {() => firebase.auth().signOut()} style={{ position: "fixed", right: "10px", color:"white"}}>Sign-out</Button>
                        </nav>
                    </AppBar>
                
                    <Switch>
                    <Route path="/favorites">
                        {/* Add an SvgDisplay element, passing in this.state.favorites as the svgs property*/}                        
                    </Route>
                    <Route path="/shared">
                        {/* Add an SvgDisplay element, passing in this.state.public as the svgs property
                            Also set showLikes to true, and pass in an onClick event to "like" an item
                        */}                        
                        <SvgDisplay svgs={this.state.public} onClick = {(d) => this.like(d)} showLikes={true}/> 
                    </Route>
                    <Route exact path="/">
                        <div style={{ display: "inline-block", margin: "20px", marginTop:"50px"}}>                            
                            <div style={{ display: "inline-block", width: "300px" }}>
                                <Typography variant="h6" gutterBottom>Controls</Typography>
                                <Controls onUpdate={this.handleChange.bind(this)} inputs={ControlSettings} />

                                <div style={{ display: "inline-block" }}>
                                    <label htmlFor="color">Line Color: </label>
                                    <input defaultValue={this.state.lineColor} type="color" onChange={(event) => this.handleChange(event.target.value, "lineColor")} />
                                </div>

                                <div style={{ display: "inline-block" }}>
                                    <label htmlFor="color">Background Color: </label>
                                    <input type="color" onChange={(event) => this.handleChange(event.target.value, "backgroundColor")} />
                                </div>
                                <div>
                                    {/* Add on click evernts to save and share (respectively*/}
                                    <Button style={{width:"100px", marginBottom:"10px", display:"block"}} variant="contained" color="primary">Save</Button>                                    
                                    <Button style={{width:"100px", marginBottom:"10px", display:"block"}} variant="contained" color="primary">Share</Button>
                                </div>
                            </div>
                            <div style={{ display: "inline-block", verticalAlign: "Top" }}>
                                <svg height={height} width={width} >
                                    <rect height={height} width={width} fill={this.state.backgroundColor} />
                                    <NoiseField
                                        num_lines={this.state.num_lines}
                                        max_steps={this.state.max_steps}
                                        stepLength={this.state.stepLength}
                                        noiseScale={this.state.noiseScale}
                                        lineColor={this.state.lineColor}
                                    />
                                </svg >
                            </div>                            
                        </div>
                    </Route>
                    </Switch>                
                </div>
            </Router>
            
        );
    }

}