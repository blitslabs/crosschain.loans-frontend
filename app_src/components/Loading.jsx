import React from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import ReactLoading from 'react-loading'


function Loading(props) {
    return (
        <div style={{ position: 'absolute', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', height: '100vh', zIndex:'2000', background:'white' }}>
            <div style={{textAlign:'center'}}>
                {/* <img style={{ width: '30vh' }} src="assets/images/logo.png" /> */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-150px' }}>
                    <ReactLoading className="preloader" type='cubes' color='#32ccdd' height={100} width={250} />
                </div>
            </div>
        </div>
    )
}

export default Loading