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
                flip:false, //face different direction, use when turn around. (not impermented)
            },
            appearance:{
                sprite:null,
                frame:0,
                totalFrame:0,
                resetAfterFinish : false,
                resetToAfterFinish : null,
            },
            
        }

        this.arrayOfMobs = [] //stores mobs obj that currently exist.

        this.sprites = {
            //player's character sprites
            charWalk : {
                img: new Image(),
                totalFrame: 4, //just start count at 1 here
            },

            charAtk1 : {
                img: new Image(),
                totalFrame: 7, //just start count at 1 here
            },
            //mob sprties
            greenBoiWalk:{img: new Image(),totalFrame: 4,},

        }
        this.sprites.charWalk.img.src = "../../../pictures/walkSprite.png" //set the src of the img initialized ^
        this.sprites.charAtk1.img.src = "../../../pictures/charAtk1Sprite.png"
        this.sprites.greenBoiWalk.img.src = "../../../pictures/walkSprite2.png"


        this.mobStat = { //spawn mobs using these stats
            greenBoi:{
                hp:10,
                atk:1,
                wlkSpd:3,
                skills:[],
                sprites:{
                    walk: this.sprites.greenBoiWalk, //need to do walk.img to get the img.
                    attack:null,
                }
            },
            mech:{}
        }

        //set char appearance
        this.mainCharStat.appearance.sprite = this.sprites.charWalk.img
        this.mainCharStat.appearance.totalFrame = this.sprites.charWalk.totalFrame
        this.mainCharStat.appearance.resetToAfterFinish = this.sprites.charWalk // not add .img so can get frame also.

        this.otherVar = {
            gameTick: 125, //125 is pretty good 8fps
            gameTime: 0,
            boardKeyState:{
                downW : false,
                downA : false,
                downS : false,
                downD : false,

                downJ : false,
            },
        }
        //-------methods-----------------
        this.setSpriteForWalking = ()=>{
            this.mainCharStat.appearance.sprite = this.sprites.charWalk.img
            this.mainCharStat.appearance.totalFrame = this.sprites.charWalk.totalFrame
            this.mainCharStat.appearance.frame += 1
        } 

        this.playSprite = (sheetName,target) => {
            this[target].appearance.frame = 0
            this[target].appearance.sprite = this.sprites[sheetName].img
            this[target].appearance.totalFrame = this.sprites[sheetName].totalFrame
            this[target].appearance.resetAfterFinish = true

            //console.log(this[target].appearance.sprite)
            //console.log(this[target].appearance.totalFrame)
        }

        this.checkForReset = (target) =>{ //checks for reset and loops sprite
            if (this[target].appearance.resetAfterFinish === true){
                //console.log("a")
                //console.log(this[target].appearance.frame) //will print the frame of the current playing sprite
                if(this[target].appearance.totalFrame > this[target].appearance.frame){
                    this[target].appearance.frame+=1 //enable later when 
                }else{
                    this[target].appearance.sprite = this[target].appearance.resetToAfterFinish.img
                    this[target].appearance.totalFrame = this[target].appearance.resetToAfterFinish.totalFrame
                    this[target].appearance.frame = 0
                    this[target].appearance.resetAfterFinish=false
                    

                }
            }

        }

        this.moveChar = ()=>{

            if (this.otherVar.boardKeyState.downJ === true && this.mainCharStat.appearance.resetAfterFinish === false){ //false prevent this from excuting many time
                this.playSprite("charAtk1","mainCharStat")
                this.collisionDetection()

            }else{

                if (this.otherVar.boardKeyState.downW === true){
                    this.mainCharStat.charPosition.y-=10;
                    this.mainCharStat.appearance.frame+=1
                }
                
                if (this.otherVar.boardKeyState.downA === true){
                    this.mainCharStat.charPosition.x-=10;
                    this.mainCharStat.appearance.frame+=1
                }
            
                if (this.otherVar.boardKeyState.downS === true){
                    this.mainCharStat.charPosition.y+=10;
                    this.mainCharStat.appearance.frame+=1
                }
        
                if (this.otherVar.boardKeyState.downD === true){
                    this.mainCharStat.charPosition.x+=10;
                    this.mainCharStat.appearance.frame+=1

                }
                //this.setSpriteForWalking()
            }
        }

        this.appendMob = (canvasContex)=>{
            this.arrayOfMobs.forEach((v,i)=>{
                canvasContex.drawImage(
                    v.appearance.sprite,   //img
                    0,    //sx
                    0,    //sy
                    128,    //swidth
                    128,    //sheight
                    v.charPosition.x,    //x
                    v.charPosition.y,    //y
                    128,    //width
                    128    //height
                    )
            })
        }

        this.showHitBox = (ctx)=>{
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "red";
            ctx.rect(this.mainCharStat.charPosition.x,this.mainCharStat.charPosition.y,128,128)//draw main char hitbox (not actually hit box, but is hit box if you put in the same value as collision Detection.)
            ctx.rect(this.arrayOfMobs[0].charPosition.x,this.arrayOfMobs[0].charPosition.y,128,128)
            ctx.stroke();
        }

        this.collisionDetection = ()=>{ //assume 128^2

            //check for collison if charCenter.x + 64 > mob x or charCenter.x - 64 < mob x + 128, then check the same for y
            this.arrayOfMobs.forEach((v,i)=>{
                if(v.charPosition.x < this.mainCharStat.charPosition.x + 128 && v.charPosition.x+128 > this.mainCharStat.charPosition.x){//x works fine
                    //console.log("x hit")
                    if(v.charPosition.y < this.mainCharStat.charPosition.y + 128 && v.charPosition.y+128 > this.mainCharStat.charPosition.y){

                        //console.log("y hit")
                        console.log(v.name+" got hit")
                    }
                    //not colliding
                    
                }

            })


        }

        this.checkForMobDie = ()=>{}
        //--------Mob constructor------------
        this.MakemMob = (mobType,spawnX,spawnY)=>{
            let mob = {}
            mob.name = mobType
            mob.hp = this.mobStat[mobType].hp
            mob.atk = this.mobStat[mobType].atk
            mob.wlkSpd = this.mobStat[mobType].wlkSpd
            mob.skills = this.mobStat[mobType].skills

            mob.sprites = {}
            mob.sprites.walk = this.mobStat[mobType].sprites.walk

            mob.charPosition = {}
            mob.charPosition.x = spawnX
            mob.charPosition.y = spawnY
            mob.charPosition.flip = false
        
            mob.appearance = {}
            mob.appearance.sprite = mob.sprites.walk.img
            mob.appearance.frame = 0
            mob.appearance.totalFrame = mob.sprites.walk.totalFrame
            mob.appearance.resetAfterFinish = false
            mob.appearance.resetToAfterFinish = mob.sprites.walk //.img left out intentionally
            
            // console.log(mob)
            //push mob in the array that stores mobs
            this.arrayOfMobs.push(mob)
            console.log(this.arrayOfMobs)
        }

        //-------------------------
        let contx

        window.onload = ()=>{
            console.log(this.myRef)
            contx = this.myRef.current.getContext("2d")
            // console.log( contx)

            this.myRef.current.height = 500//700
            this.myRef.current.width = 500//900

            this.MakemMob("greenBoi",200,200)
        }

        setInterval(()=>{ //<------stuff are done here, since this is what redraws the canvas every so often
            //console.log(typeof contx) //<-- prints 2 things 1. the actual canvas obj 2. undefine ???

            if(typeof contx !== 'undefined'){ //<--- 'filters out' the above
                contx.clearRect(0,0,500,500)//-contx.width,contx.height)

                //console.log(contx)
                contx.drawImage(
                    this.mainCharStat.appearance.sprite,    //image
                    (this.mainCharStat.appearance.frame % this.mainCharStat.appearance.totalFrame)*128,  //sx
                    0*128,  //sy
                    128,    //swidth
                    128,    //sheight
                    this.mainCharStat.charPosition.x,   //x
                    this.mainCharStat.charPosition.y,   //y
                    128,    //width
                    128     //height
                    )
                
                this.appendMob(contx)
                this.moveChar() //moves charactor
                    //console.log(this.mainCharStat.appearance.frame % this.mainCharStat.appearance.totalFrame)
                this.checkForReset("mainCharStat") // check if the animation should reset to default animation

                this.showHitBox(contx)



                this.otherVar.gameTime += 1
                
            }

            //contx.drawImage(this.sprites.charWalk, this.charPosition.x, this.charPosition.y,128,128,0,0,128,128)

        },this.otherVar.gameTick);

        window.onkeydown = (e)=>{ // set interval check if key is true or false, then moves character accordingly
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

    }


    //don't know how this work, it just does i guess.
    focusCanvas(){
        this.myRef.current.focus();
        
    }
/*^^^^^^^^^ important canvas will not work without*/

    // setUpCanvasAndDrawPicture(){
    //     //let contx = this.myRef.canvas.getContext("2d")
    //     console.log(this.myRef)
    //     let contx = this.myRef.current.getContext("2d")

    //     // //resize
    //     // this.myRef.current.height = 700
    //     // this.myRef.current.width = 900

    //     // console.log("aaaaaaaaa")
    //     // this.canvasContext.beginPath();
    //     // this.canvasContext.arc(95, 50, 40, 0, 2 * Math.PI);
    //     // this.canvasContext.stroke();
    //     //^^^^^^^^ignore this, but both ^^^ and vvv does the same thing: draw a circle
    //     // contx.beginPath();
    //     // contx.arc(95, 50, 40, 0, 2 * Math.PI);
    //     // contx.stroke();

    //     //setup image to draw
    //     //let image_CharWalk = new Image()
    //     //image_CharWalk.src = "../../../pictures/walkSprite.png"
    //     //console.log(contx)
    //     //console.log(image_CharWalk.width + " " + image_CharWalk.height)
    //     contx.drawImage(this.sprites.charWalk,
    //                     this.charPosition.x,
    //                     this.charPosition.y,128,128,0,0,128,128)
    // }
    

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