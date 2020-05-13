import React, { Component } from 'react'

export default class SelfBar extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();

        this.state = {
            barColor:"red"
        }
    }
    render(){            
        if(this.props.target === null){ //when you're hitting anything
            return(
                <div className="charUI">
                    <div className="yourBars">
                        <div className="hpHolderChar"><div className="hpChar"></div></div>
                        <div className="mpHolderChar"><div className="mpChar"></div></div>
                        <div className="defHolderChar"><div className="defChar"></div></div>
                    </div>

                    <div className="skills">

                    </div>
                </div>
            )
        }
    }
}