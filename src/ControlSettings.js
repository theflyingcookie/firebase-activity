const ControlSettings =  {
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

export default ControlSettings;