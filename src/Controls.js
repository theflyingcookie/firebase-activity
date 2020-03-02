import React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

export class Controls extends React.Component {
    render() {
        return (
            <div style={{ marginLeft: "10px", width: "200px", display: "inline-block" }}>
                {Object.keys(this.props.inputs).map((key, i) => {
                    return (
                        <div key={i}>
                            <Typography>{this.props.inputs[key].label}</Typography>
                            <Slider
                                key={key}
                                onChange={(event, newValue) => this.props.onUpdate(newValue, key)}
                                defaultValue={this.props.inputs[key].value}
                                min={this.props.inputs[key].min}
                                max={this.props.inputs[key].max} />
                        </div>
                    )
                })
                }
            </div>
        )
    }
}
