import React, { Component, useState } from 'react'

export default class GameCanvas extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();

        this.state = {
            
            a: 0
        }
        //-------var---------------
        this.mainCharStat = { 
            charPosition:{
                x:0,
                y:0,
            },
            appearance:{
                sprite:null,
                frame:0,
                totalFrame:0,
            },
            
            getAppearance : ()=>{
                return this.appearance
            },

            setAppearance : (p,v)=>{
                this.appearance[p] = v
            }
        }

        this.statAndStuff = {
            mainChar:{
                sprite:null,
                frame:0,
            },
            Mech:{}
        }
        
        this.sprites = {
            charWalk : {
                img: new Image(),
                totalFrame: 3, //4-1 we start counting at 0

            }

            

        }
        this.sprites.charWalk.img.src = "../../../pictures/walkSprite.png" //set the src of the img initialized ^

        this.otherVar = {
            gameTick: 1000,
            boardKeyState:{
                downW : false,
                downA : false,
                downS : false,
                downD : false
            },
        }
        //-------methods-----------------
        this.moveChar = ()=>{
            if (this.otherVar.boardKeyState.downW === true){
                this.mainCharStat.charPosition.y-=10;
            }
            
            if (this.otherVar.boardKeyState.downA === true){
                this.mainCharStat.charPosition.x-=10;
            }
        
            if (this.otherVar.boardKeyState.downS === true){
                this.mainCharStat.charPosition.y+=10;
            }
    
            if (this.otherVar.boardKeyState.downD === true){
                this.mainCharStat.charPosition.x+=10;
            }

        }

        //-------------------------
        let contx

        window.onload = ()=>{
            console.log(this.myRef)
            contx = this.myRef.current.getContext("2d")
            // console.log( contx)

            this.myRef.current.height = 350//700
            this.myRef.current.width = 350//900
        }

        setInterval(()=>{ //<------stuff are done here, since this is what redraws the canvas every so often
            //console.log(typeof contx) //<-- prints 2 things 1. the actual canvas obj 2. undefine ???

            if(typeof contx !== 'undefined'){ //<--- 'filters out' the above
                contx.clearRect(0,0,350,350)//-contx.width,contx.height)

                //console.log(contx)
                contx.drawImage(this.sprites.charWalk.img, 0*128, 0*128,128,128,this.mainCharStat.charPosition.x, this.mainCharStat.charPosition.y,128,128)
                this.moveChar()
                


                

            }

            //contx.drawImage(this.sprites.charWalk, this.charPosition.x, this.charPosition.y,128,128,0,0,128,128)

        },this.otherVar.gameTick);

        window.onkeydown = (e)=>{
            //console.log(e.key)
            if (typeof this.otherVar.boardKeyState['down'+e.key.toUpperCase()] !== 'undefined'){//<--prevent making of new down_ variables / null check
                this.otherVar.boardKeyState['down'+e.key.toUpperCase()] = true
            }
            //console.log(this.otherVar.boardKeyState['down'+e.key.toUpperCase()]) 
        }

        window.onkeyup = (e)=>{
            //console.log(e.key)
            if (typeof this.otherVar.boardKeyState['down'+e.key.toUpperCase()] !== 'undefined'){//<--prevent making of new down_ variables / null check
                this.otherVar.boardKeyState['down'+e.key.toUpperCase()] = false
            }
            //console.log(this.otherVar.boardKeyState['down'+e.key.toUpperCase()])
        }

        // setInterval(() => {
        //     this.setState({a:this.state.a+=1}) 
        // }, 1000);

    }


    //don't know how this work, it just does i guess.
    focusCanvas(){
        this.myRef.current.focus();
        
    }

    setUpCanvasAndDrawPicture(){
        //let contx = this.myRef.canvas.getContext("2d")
        console.log(this.myRef)
        let contx = this.myRef.current.getContext("2d")

        // //resize
        // this.myRef.current.height = 700
        // this.myRef.current.width = 900

        // console.log("aaaaaaaaa")
        // this.canvasContext.beginPath();
        // this.canvasContext.arc(95, 50, 40, 0, 2 * Math.PI);
        // this.canvasContext.stroke();
        //^^^^^^^^ignore this, but both ^^^ and vvv does the same thing: draw a circle
        // contx.beginPath();
        // contx.arc(95, 50, 40, 0, 2 * Math.PI);
        // contx.stroke();

        //setup image to draw
        //let image_CharWalk = new Image()
        //image_CharWalk.src = "../../../pictures/walkSprite.png"
        //console.log(contx)
        //console.log(image_CharWalk.width + " " + image_CharWalk.height)
        contx.drawImage(this.sprites.charWalk,
                        this.charPosition.x,
                        this.charPosition.y,128,128,0,0,128,128)
    }

    cycleSprite(row,column,img,frame,totalFrame){//assuming it's 128^2, plug this into contx draw image
        let imgToDraw = new Image()
        imgToDraw.src = img
        let width = img.width
        //let height = img.height
        
        return {x:width/(totalFrame-frame)-1, y:row*128} //start frame
    }
    

//----------------------------------------------------------

    render(){            

        return(
            

       // <div onKeyDown={(e)=>(this.keyHandle(e))}>
       <div>
            
            {/* <canvas className="can" ref={(c) => this.canvasContext = c.getContext('2d')}/> */}
            <canvas className="can" ref={this.myRef} onLoad={()=>console.log("loaded")} />
            {/* <button onClick={()=>this.setUpCanvasAndDrawPicture()}>aaa</button> */}
            {/* use below div to test if path is good */}
            {/* <img src="../../../pictures/walkSprite.png"></img> */}
            <h1>aaaa{this.state.a}</h1>

        </div>
    )}

    
    
}