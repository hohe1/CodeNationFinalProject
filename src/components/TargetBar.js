import React, { Component } from 'react'

export default class TargetBar extends Component{
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

                <div className="TargetBar">
                    <div className="nameMob">-</div>
                    <div className="hpHolder"><span className="hp"></span></div>
                </div>
            )
        }else{
            let hpWidth = this.props.target.hp / this.props.target.maxHp
            let toPercent = hpWidth*100 + "%"
            //console.log(toPercent)

            return(

                <div className="TargetBar">
                    <div className="nameMob">Currenly Fighting: {this.props.target.name}</div>
                    <div className="hpHolder">
                        <div className="hp" style={{width:toPercent}}></div>
                    </div>
                </div>
            )
        }
    }
}