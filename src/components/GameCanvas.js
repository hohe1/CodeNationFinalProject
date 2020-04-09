import React, { Component } from 'react'

export default class GameCanvas extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();

        this.state = {
            playerPositionX: 0,
            playerPositionY: 0,

        }
    }

//-------events functions---------------------------------------------------
    keyBoardHandle(){
        console.log("bbbb")
    }

//----------------------------------------------------------
    //don't know how this work, it just does i guess.
    focusCanvas(){
        this.myRef.current.focus();
    }

    setUpCanvasAndDrawPicture(){
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

        //setup image to draw
        let image_CharWalk = new Image()
        image_CharWalk.src = "../../../pictures/walkSprite.png"
        //console.log(contx)
        console.log(image_CharWalk.width + " " + image_CharWalk.height)
        contx.drawImage(image_CharWalk,0,0,128,128,0,0,128,128)  //<--(!) for some reason need to click twice to draw
    }

    cycleSprite(row,column,img,frame,totalFrame){//assuming it's 128^2, plug this into contx draw image
        let imgToDraw = new Image()
        imgToDraw.src = img
        let width = img.width
        //let height = img.height
        
        return {x:width/(totalFrame-frame)-1, y:row*128} //start frame
    }

    render(){return(
        <div>
            {/* <canvas className="can" ref={(c) => this.canvasContext = c.getContext('2d')}/> */}
            <canvas className="can" ref={this.myRef} onKeyPress={()=>this.keyBoardHandle()}/>
            <button onClick={()=>this.setUpCanvasAndDrawPicture()}>aaa</button>
            {/* use below div to test if path is good */}
            {/* <img src="../../../pictures/walkSprite.png"></img> */}

        </div>
    )}

    
    
}