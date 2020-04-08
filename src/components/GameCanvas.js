import React, { Component } from 'react'

export default class GameCanvas extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();
    }
    //don't know how this work, it just does i guess.
    focusCanvas(){
        this.myRef.current.focus();
    }

    handleClicked(){
        //let contx = this.myRef.canvas.getContext("2d")
        console.log(this.myRef)
        let contx = this.myRef.current.getContext("2d")

        //resize
        this.myRef.current.height = 700
        this.myRef.current.width = 900

        // console.log("aaaaaaaaa")
        // this.canvasContext.beginPath();
        // this.canvasContext.arc(95, 50, 40, 0, 2 * Math.PI);
        // this.canvasContext.stroke();
        //^^^^^^^^ignore this, but both ^^^ and vvv does the same thing: draw a circle
        // contx.beginPath();
        // contx.arc(95, 50, 40, 0, 2 * Math.PI);
        // contx.stroke();

    }

    render(){return(
        <div>
            {/* <canvas className="can" ref={(c) => this.canvasContext = c.getContext('2d')}/> */}
            <canvas className="can" ref={this.myRef}/>
            <button onClick={()=>this.handleClicked()}>aaa</button>
        </div>
    )}


}