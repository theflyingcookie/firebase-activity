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

// Firebase 
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

// Configure Firebase.
const config = {
    apiKey: "AIzaSyA3Qq8ALZ0RLZyThRCeX1WtyEymYr7zNlU",
    authDomain: "fir-952d8.firebaseapp.com",
    databaseURL: "https://fir-952d8.firebaseio.com",
    projectId: "fir-952d8",
    storageBucket: "fir-952d8.appspot.com",
    messagingSenderId: "896239704744",
    appId: "1:896239704744:web:0eb0d811207267973b409d",
    measurementId: "G-3HDCV3RNSQ"
};
firebase.initializeApp(config);

// UI config
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
        this.favoritesRef = firebase.database().ref('favorites');
        this.publicRef = firebase.database().ref('public');
        this.publicRef.on("value", (snapshot) => {
            this.setState({ public: snapshot.val() })
        })
        this.like = this.like.bind(this);
    }
    handleChange(value, key) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {                        
            this.setState({ isSignedIn: !!user })            
            const userRef = this.favoritesRef.child(user.uid);
            userRef.on("value", (snapshot) => {
                this.setState({ favorites: snapshot.val() })
            })            
           
        })
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }
    save() {
        const s = new XMLSerializer();
        const svgStr = s.serializeToString(document.querySelector("svg"));
        const userRef = this.favoritesRef.child(firebase.auth().currentUser.uid)
        userRef.push({
            svg: svgStr,
            time:firebase.database.ServerValue.TIMESTAMP
        });
    }

    share() {
        const s = new XMLSerializer();
        const svgStr = s.serializeToString(document.querySelector("svg"));        
        this.publicRef.push({
            svg: svgStr,
            time:firebase.database.ServerValue.TIMESTAMP, 
            likes:0
        });
    }

    like(svgId) {
        console.log(this.svgId)
        const likesRef = this.publicRef.child(svgId + "/likes");
        likesRef.transaction((d) => d + 1);
    }
    render() {
        if (!this.state.isSignedIn) {
            return (
                <div>
                    <h1>My App</h1>
                    <p>Please sign-in:</p>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
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
                            <Button style={{ position: "fixed", right: "10px", color:"white"}} onClick={() => firebase.auth().signOut()}>Sign-out</Button>
                        </nav>
                    </AppBar>
                
                    <Switch>
                    <Route path="/favorites">
                        <SvgDisplay svgs={this.state.favorites}/>                        
                    </Route>
                    <Route path="/shared">
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
                                    <Button style={{width:"100px", marginBottom:"10px", display:"block"}} variant="contained" color="primary" onClick={() => this.save()}>Save</Button>                                    
                                    <Button style={{width:"100px", marginBottom:"10px", display:"block"}} variant="contained" color="primary" onClick={() => this.share()}>Share</Button>
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