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
            let hpWidth = this.props.hp / this.props.mhp
            let toPercentHp = hpWidth*100 + "%"

            let mpWidth = this.props.mp / this.props.mmp
            let toPercentMp = mpWidth*100 + "%"

            let defArr = []
            for(let i=0;i<this.props.def;i++){
                defArr.push(<div className="def" key={i+"def"}></div>)
            }

        return(
            <div className="charUI">
                <div className="yourBars">

                    <div className="hpHolderChar">
                        <div className="hpChar" style={{width:toPercentHp}}></div>
                    </div>

                    <div className="mpHolderChar">
                        <div className="mpChar" style={{width:toPercentMp}}></div>
                    </div>

                    <div className="defHolderChar">
                        {defArr}
                    </div>

                </div>
                    <div className="skills">
                </div>
            </div>
        )
    }
}