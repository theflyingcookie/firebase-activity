import React from 'react';
import InlineSVG from 'svg-inline-react';
import { Controls } from './Controls';
import { NoiseField } from './NoiseField';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container'
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
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
};

const height = 600;
const width = 900;

const controlSettings = {
    num_lines: {
        label: "Number of Lines",
        min: 1,
        max: 500,
        value: 200
    },
    stepLength: {
        label: "Length of Each Step",
        min: 1,
        max: 100,
        value: 30
    },
    max_steps: {
        label: "Maximum Number of Steps",
        min: 1,
        max: 500,
        value: 200
    },
    noiseScale: {
        label: "Noise Scale",
        min: 100,
        max: 3000,
        value: 1000
    }

}
export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num_lines: controlSettings.num_lines.value,
            noiseScale: controlSettings.noiseScale.value,
            seed: 1,
            max_steps: controlSettings.max_steps.value,
            stepLength: controlSettings.stepLength.value,
            lineColor: "#FF0000",
            backgroundColor: "#000000",
            isSignedIn: false, // Local signed-in state.
            userRef: false
        }
        this.favoritesRef = firebase.database().ref('favorites');
    }
    handleChange(value, key) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {            
            const user_id = user === null ? "none" : user.uid
            this.setState({ user: user_id, isSignedIn: !!user, userRef: this.favoritesRef.child(user_id) })            
            const userRef = this.favoritesRef.child(user_id);
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
        const userRef = this.favoritesRef.child(this.state.user)
        userRef.push({
            svg: svgStr
        });
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
                            <Button><Link style={{ textDecoration: 'none', color:"white"}} to="/favorites">Favorites</Link></Button>
                            <Button><Link style={{ textDecoration: 'none', color:"white"}} to="/shared">Shared</Link></Button>
                            <Button style={{ position: "fixed", right: "10px", color:"white"}} onClick={() => firebase.auth().signOut()}>Sign-out</Button>
                        </nav>
                    </AppBar>
                
                    <Switch>
                    <Route path="/favorites">
                        <div>
                            {this.state.favorites && Object.keys(this.state.favorites).map((d) => {
                                return <Container style={{textAlign:"center"}}><InlineSVG src={this.state.favorites[d].svg} /></Container>
                            })}
                        </div>
                    </Route>
                    <Route path="/shared">
                        <div>I am on the shared div</div>
                    </Route>
                    <Route exact path="/">
                        <div style={{ display: "inline-block", margin: "20px", marginTop:"50px"}}>
                            
                            <div style={{ display: "inline-block", width: "300px" }}>
                                <Controls onUpdate={this.handleChange.bind(this)} inputs={controlSettings} />

                                <div style={{ display: "inline-block" }}>
                                    <label htmlFor="color">Line Color</label>
                                    <input defaultValue={this.state.lineColor} type="color" onChange={(event) => this.handleChange(event.target.value, "lineColor")} />
                                </div>

                                <div style={{ display: "inline-block" }}>
                                    <label htmlFor="color">Background Color</label>
                                    <input type="color" onChange={(event) => this.handleChange(event.target.value, "backgroundColor")} />
                                </div>
                                <div>
                                    <button onClick={() => this.save()}>Save</button>
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