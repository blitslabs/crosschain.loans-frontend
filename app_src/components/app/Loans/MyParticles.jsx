import React, { Component } from 'react'
import Particles from 'react-particles-js'

class MyParticles extends Component {
    render() {
        return (
            <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 200,
                            density: {
                                enable: false,
                                value_area: 400
                            }
                        },
                        "color": {
                            "value": "#32CCDD"
                        },
                        opacity: {
                            value: 0.5,
                            random: false,

                        },
                        "size": {
                            "value": 4,
                            "random": true
                        },
                        "move": {
                            "direction": "bottom",
                            "out_mode": "out"
                        },
                        "line_linked": {
                            "enable": false
                        },

                        "interactivity": {
                            "events": {
                                "onclick": {
                                    "enable": true,
                                    "mode": "repulse"
                                }
                            },
                            "modes": {
                                "remove": {
                                    "particles_nb": 10
                                }
                            }
                        }
                    }
                }}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'

                }}
            />
        )
    }
}

export default MyParticles