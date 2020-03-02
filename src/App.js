import React from 'react';
import { Controls } from './Controls';
import { NoiseField } from './NoiseField';
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
            backgroundColor: "#000000"
        }
    }
    handleChange(value, key) {
        console.log(value, key)
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }
    render() {
        return (
            <div style={{ display: "inline-block", margin: "20px" }}>
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
        );
    }

}