import React from 'react';
import SimplexNoise from 'simplex-noise';
import PVector from 'pvectorjs';
import _ from 'lodash';
const TAU = Math.PI * 2;
const simplex = new SimplexNoise();
const height = 600;
const width = 900;
export class NoiseField extends React.Component {
    render() {
        return (
            _.range(this.props.num_lines).map((line) => {
                let i = 0;
                let y = Math.random(this.props.seed) * height;
                let x = Math.random(this.props.seed) * width;
                let v = PVector(x, y)

                let isInside = true;
                let d = `M${x} ${y}`
                while (isInside) {
                    const angle = simplex.noise3D(v.x / this.props.noiseScale, v.y / this.props.noiseScale, this.props.seed) * TAU;
                    v.add(PVector.fromAngle(angle).setMag(this.props.stepLength))
                    isInside = (v.x) >= 0 && (v.x) <= width && (v.y) >= 0 && (v.y) <= height && i < this.props.max_steps;
                    d += `L${v.x} ${v.y}`;
                    i++;
                }
                return (<path
                    key={line}
                    stroke={this.props.lineColor}
                    strokeWidth="1px"
                    fill="none"
                    d={d}
                />)
            })
        )
    }

}

// Default values
NoiseField.defaultProps = {
    noiseScale: 100,
    width: 500,
    height: 500,
    seed: 1,
    num_lines: 100,
    max_steps: 10,
    stepLength: 10,
    lineColor: "black"
}