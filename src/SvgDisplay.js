
import InlineSVG from 'svg-inline-react';
import React from 'react';
import Container from '@material-ui/core/Container';
import {FaHeart} from 'react-icons/fa'
export default function SvgDisplay(props) {
    return (
        <div>
            {props.svgs && Object.keys(props.svgs).sort((a, b) => props.svgs[b].time - props.svgs[a].time).map((d) => {
                return (<Container style={{textAlign:"center", marginTop:"40px"}}>
                            <InlineSVG src={props.svgs[d].svg} />                            
                            {props.showLikes && 
                                <span onClick = {() => props.onClick(d)}><FaHeart fill="red" style={{cursor:"pointer"}}/><span>{props.svgs[d].likes}</span></span>}
                        </Container>)
            })}
        </div>
    )
}