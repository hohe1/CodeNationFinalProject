import React, { Component, useState } from 'react'
import Targetbar from './TargetBar.js';
import SelfBar from './SelfBar.js';

const constantVar = {

}

export default class GameCanvas extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();

        this.state = {
            mobBeingHit: null,
            charHp: 250,
            charMp: 250,
            charDef: 3
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
            stat:{
                maxhp:250, 
                maxmp:250, 
                atk: 10,
                wlkSpd: 10, // not in use at the moment
                moveSet:0,
                knockBack: 8,
                Lcharge: 0,
                
            }
        }

        this.arrayOfMobs = [] //stores mobs obj that currently exist.
        this.arrayOfProjectiles = []

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

            charAtk2 : {
                img: new Image(),
                totalFrame: 6, //just start count at 1 here
            },

            charAtk3 : {
                img: new Image(),
                totalFrame: 5, //just start count at 1 here
            },

            charBlock : {
                img: new Image(),
                totalFrame: 1, //just start count at 1 here
            },
            charDied : {img: new Image(),totalFrame: 1},
            //projectiles
            swordWave:{img: new Image(),totalFrame: 1},
            blade:{img: new Image(),totalFrame: 1},
            //mob sprties
            greenBoiWalk:{img: new Image(),totalFrame: 4,},
            greenBoiAtk:{img: new Image(),totalFrame: 7,},

            madManAtk1:{img: new Image(),totalFrame: 6},
            madManSkill1:{img: new Image(),totalFrame: 6},
            madManSkill2:{img: new Image(),totalFrame: 4},
            madmanWalk:{img: new Image(),totalFrame: 2}

        }
        this.sprites.charWalk.img.src = "../../../pictures/walkSprite.png" //set the src of the img initialized ^
        this.sprites.charAtk1.img.src = "../../../pictures/charAtk1Sprite.png"
        this.sprites.charAtk2.img.src = "../../../pictures/charAtk2Sprite.png"
        this.sprites.charAtk3.img.src = "../../../pictures/charAtk3Sprite.png"
        this.sprites.charBlock.img.src = "../../../pictures/mainChar_block.png"
        this.sprites.charDied.img.src = "../../../pictures/mainChar_Died.png"

        this.sprites.swordWave.img.src = "../../../pictures/swordWave.png"
        this.sprites.blade.img.src = "../../../pictures/madman_blade.png"

        this.sprites.greenBoiWalk.img.src = "../../../pictures/walkSprite2.png"
        this.sprites.greenBoiAtk.img.src = "../../../pictures/GreenAtk1Sprite.png"

        this.sprites.madManAtk1.img.src = "../../../pictures/madman_atk.png"
        this.sprites.madManSkill1.img.src = "../../../pictures/madman_skill.png"
        this.sprites.madManSkill2.img.src = "../../../pictures/madman_skill2.png"
        this.sprites.madmanWalk.img.src = "../../../pictures/madman_walk.png"

        this.mobStat = { //spawn mobs using these stats
            greenBoi:{
                hp:250,
                atk:10,
                wlkSpd:5,
                knockResistance:0,
                skills:[],
                isAttking: false,
                cd: 14,
                sprites:{
                    walk: this.sprites.greenBoiWalk, //need to do walk.img to get the img.
                    attack:null,
                },
                behavior: (self)=>{
                    //move towards player: set the position so next time it renders closer to the player
                    
                    //wait some time
                    
                    //still within attack range? (64px?)
                    if(self.charPosition.x <= this.mainCharStat.charPosition.x + 50 && self.charPosition.x+50 >= this.mainCharStat.charPosition.x){//x works fine  //changed to 100 so mob walk closer, sheet 128^2 
                        if(self.charPosition.y <= this.mainCharStat.charPosition.y + 50 && self.charPosition.y+50 >= this.mainCharStat.charPosition.y){  //need to change mobwalksprite so he will get close enough
                            //this.mainCharStat.hp -= this.mainCharStat.stat.atk
                            //this.playSprite("charAtk1",self)
                            this.mobSpritePlay(self,"greenBoiAtk") //attack begin

                            if(!self.isAttking && self.atkCd === 0 && self.appearance.frame%self.appearance.totalFrame === 3){ //only attaks once per animation
                                if(this.otherVar.boardKeyState.downK && this.state.charDef > 0){ // if player is holding down k key, aka if blocking
                                    this.setState({"charDef": this.state.charDef - 1 })  //player blocked attack
                                }else{
                                    this.setState({"charHp": this.state.charHp - self.atk })  //player gets hurt
                                }
                                self.isAttking = true
                                self.atkCd = self.cd
                            }
                                
                        }else{
                            //still not in range, walk
                            this.mobWalkSprite(self,49)
                        }
                    }else{
                     //else not in range. Start walking
                     this.mobWalkSprite(self,49)
                    }
                    

                    //wait for cd
                    if(self.atkCd > 0){
                        self.atkCd -= 1
                        if (self.appearance.frame % self.appearance.totalFrame === 0){
                            self.appearance.frame = 0
                            this.mobWalkSprite(self,49)
                        }
                    }
                    //reset isAttacking
                    if(self.appearance.frame % self.appearance.totalFrame === 0){
                        self.isAttking = false
                    }
                    //repaet until died
                },
                
            },

            madMan:{
                hp:666,
                atk:66,
                wlkSpd:10,
                knockResistance:0,
                skills:[],
                isAttking: false,
                cd: 10,
                sprites:{
                    walk: this.sprites.madmanWalk, //need to do walk.img to get the img.
                    attack:null,
                },
                behavior: (self)=>{
                    let mode
                    if(self.hp/self.maxHp >= .7){
                        mode = "rush"
                    }else if(self.hp/self.maxHp >= .5){
                        mode = "jump"
                    }else if(self.hp/self.maxHp >= .2){
                        self.knockResistance = 100 //prevent knock back
                        self.wlkSpd = 0
                        mode = "throw"
                    }else if(self.hp/self.maxHp >= 0){
                        self.sprites.walk = this.sprites.madManSkill2
                        self.wlkSpd = 3
                        self.cd = 0
                        mode = "rush"
                    }

                    //when madman have >80% hp: rushes player
                    switch(mode){
                        case "rush":
                            if(self.charPosition.x <= this.mainCharStat.charPosition.x + 50 && self.charPosition.x+50 >= this.mainCharStat.charPosition.x){//x works fine  //changed to 100 so mob walk closer, sheet 128^2 
                                if(self.charPosition.y <= this.mainCharStat.charPosition.y + 30 && self.charPosition.y+30 >= this.mainCharStat.charPosition.y){  //need to change mobwalksprite so he will get close enough
                                    this.mobSpritePlay(self,"madManAtk1") //attack begin

                                    if(!self.isAttking && self.atkCd === 0 && self.appearance.frame%self.appearance.totalFrame === 2){ //only attaks once per animation
                                        if(this.otherVar.boardKeyState.downK && this.state.charDef > 0){ // if player is holding down k key, aka if blocking
                                            this.setState({"charDef": this.state.charDef - 1 })  //player blocked attack
                                        }else{
                                            this.setState({"charHp": this.state.charHp - self.atk })  //player gets hurt
                                        }
                                        self.isAttking = true
                                        self.atkCd = self.cd
                                    }
                                        
                                }else{
                                    //still not in range, walk
                                    this.mobWalkSprite(self,49)
                                }
                            }else{
                            //else not in range. Start walking
                            this.mobWalkSprite(self,49)
                            }
                        break;

                        case "jump":
                            if(self.charPosition.x <= this.mainCharStat.charPosition.x + 50 && self.charPosition.x+50 >= this.mainCharStat.charPosition.x){//x works fine  //changed to 100 so mob walk closer, sheet 128^2 
                                if(self.charPosition.y <= this.mainCharStat.charPosition.y + 30 && self.charPosition.y+30 >= this.mainCharStat.charPosition.y){  //need to change mobwalksprite so he will get close enough
                                    this.mobSpritePlay(self,"madManAtk1") //attack begin

                                    if(!self.isAttking && self.atkCd === 0 && self.appearance.frame%self.appearance.totalFrame === 2){ //only attaks once per animation
                                        if(this.otherVar.boardKeyState.downK && this.state.charDef > 0){ // if player is holding down k key, aka if blocking
                                            this.setState({"charDef": this.state.charDef - 1 })  //player blocked attack
                                        }else{
                                            this.setState({"charHp": this.state.charHp - self.atk })  //player gets hurt
                                        }
                                        self.isAttking = true
                                        self.atkCd = self.cd
                                    }  
                                        
                                }

                            }else{
                            //else not in range. Start jumping
                                if(self.hasJumped === "finished"){
                                    this.mobWalkSprite(self,49)

                                    if(Math.random() > 0.7){
                                        self.hasJumped = false
                                    }
                                }

                                if(self.charPosition.y>-200 && self.atkCd<=0 && self.hasJumped===false){ //jumps off screen
                                    self.charPosition.y-=self.wlkSpd*8
                                }else if(self.charPosition.y<=-200 && self.hasJumped===false){  //reached y = -200, start faillinf
                                    self.hasJumped = true
                                    self.charPosition.x = this.mainCharStat.charPosition.x
                                }
                                //console.log(self.hasJumped)
                            }

                            if(self.charPosition.x<500 && self.atkCd>0){ //runs away after hitting
                                self.charPosition.x+=self.wlkSpd*5
                            }

                            if(self.hasJumped === true && self.atkCd<=0 && self.charPosition.y < this.mainCharStat.charPosition.y){ //if not reach player y, keep failling
                                self.charPosition.y+=self.wlkSpd*5
                                //console.log(self.charPosition.y ,  this.mainCharStat.charPosition.y)
                            }else if(self.hasJumped === true && self.atkCd<=0 && self.charPosition.y >= this.mainCharStat.charPosition.y){ //landed
                                self.hasJumped = "finished"
                                this.mobWalkSprite(self,49)
                            }
                        break;
                        
                        case "throw":
                            if(self.charPosition.y<300){ //runs to side of screen
                                self.charPosition.y += 3
                            }
                            if(self.charPosition.x<500){ //runs to side of screen
                                self.charPosition.x += 3
                            }

                            //attack begin

                            if(self.atkCd === 0){
                                this.mobSpritePlay(self,"madManSkill2")
                                if(self.appearance.frame%self.appearance.totalFrame === 3){
                                    this.makeProjectile("blade",
                                    self.charPosition.x + -20+Math.floor(Math.random()*40),
                                    self.charPosition.y-5)
                                    self.atkCd = self.cd
                                }
                            }
                        break;

                    }
                     //wait for cd
                     if(self.atkCd > 0){
                        self.atkCd -= 1
                        if (self.appearance.frame % self.appearance.totalFrame === 0 && mode !=="throw"){
                            self.appearance.frame = 0 //when there is atkcd animation will not play
                            this.mobWalkSprite(self,49)
                        }
                    }
                    //reset isAttacking
                    if(self.appearance.frame % self.appearance.totalFrame === 0){
                        self.isAttking = false
                    }
                }

            },

            mech:{},
            
            //projectiles
            swordWave:{
                name:"swordWave",
                hp : 10,
                atk:5,
                wlkSpd:10,
                sprites: this.sprites.swordWave,
                behavior: (self)=>{
                    self.charPosition.x += self.wlkSpd

                    this.arrayOfMobs.forEach((v,i)=>{
                        if(v.charPosition.x < self.charPosition.x + 32 && v.charPosition.x+32 > self.charPosition.x){//x works fine
                            //console.log("x hit")
                            if(v.charPosition.y < self.charPosition.y + 128 && v.charPosition.y+128 > self.charPosition.y){
                                //console.log("y hit")
                                v.hp -= self.atk
                                //console.log(v.hp)
                                if(v.knockResistance < 25){
                                    v.charPosition.x += 25
                                }

                                self.hp -= 2
                                this.setState({"mobBeingHit":v})
                            }
                            //not colliding
                        }
                    })
                    self.hp -= 1
                    //console.log(self.hp)
                    //destroying the wave will be handled by the cleardeadmob() function

                },
            },

            blade:{
                name:"swordWave",
                hp : 15,
                atk:66,
                wlkSpd:20,
                sprites: this.sprites.blade,
                behavior: (self)=>{
                    self.charPosition.x -= self.wlkSpd
                    self.hp -= 1

                    if(self.charPosition.x <= this.mainCharStat.charPosition.x + 50 && self.charPosition.x+50 >= this.mainCharStat.charPosition.x){
                        if(self.charPosition.y <= this.mainCharStat.charPosition.y + 30 && self.charPosition.y+30 >= this.mainCharStat.charPosition.y){
                            if(this.otherVar.boardKeyState.downK && this.state.charDef > 0){ 
                                this.setState({"charDef": this.state.charDef - 1 })  //player blocked attack
                                self.hp = 0    
                            }else{
                                this.setState({"charHp": this.state.charHp - self.atk })  //player gets hurt
                                self.hp = 0    
                            }
                        }
                    }
                    //console.log(self.hp)
                }
            }

        }

        this.levels=[
            [{mob:"greenBoi",posX:0,posY:400}], //this will not spawn due to lvl 0
            
            [{mob:"greenBoi",posX:200,posY:200}],
            [{mob:"greenBoi",posX:200,posY:200},{mob:"greenBoi",posX:200,posY:300},{mob:"greenBoi",posX:200,posY:100}],
            [{mob:"madMan",posX:0,posY:400}], //each of these array contain the mobs to be spawn when player enter a new room
            [{mob:"greenBoi",posX:100,posY:100},{mob:"greenBoi",posX:200,posY:200},{mob:"greenBoi",posX:300,posY:300},{mob:"greenBoi",posX:400,posY:400},{mob:"greenBoi",posX:500,posY:500}]

        ]

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
                downK : false,
                downL : false,
            },
            currentLevel:0,
            levelCompleted:false,
            wound : new Image(),
            arrow : new Image()

        }
        this.otherVar.wound.src = "../../../pictures/wound.png"
        this.otherVar.arrow.src = "../../../pictures/arrow.png"

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

        this.mobSpritePlay = (target,sheetName)=>{ //target is self
            if(target.appearance.resetAfterFinish === false){
                target.appearance.frame = 0
                target.appearance.sprite = this.sprites[sheetName].img
                target.appearance.totalFrame = this.sprites[sheetName].totalFrame
                target.appearance.resetAfterFinish = true
            }else{
                target.appearance.frame += 1

            }
        }

        this.mobWalkSprite=(target,distanceFromChar)=>{ //target is self
            target.appearance.resetAfterFinish = false
            target.appearance.sprite = this.mobStat[target.name].sprites.walk.img
            target.appearance.totalFrame = this.mobStat[target.name].sprites.walk.totalFrame
            target.appearance.frame += 1

            if(target.charPosition.x >= this.mainCharStat.charPosition.x + distanceFromChar){ //if not within x range   Main +128 Self  //128 and the boxes are touching(pretty much)
                target.charPosition.x -= target.wlkSpd                                 //put 94 instead of 128 because it mob walk closer
            }else if(target.charPosition.x+distanceFromChar <= this.mainCharStat.charPosition.x){
                target.charPosition.x += target.wlkSpd
            }
            
            if(target.charPosition.y !== this.mainCharStat.charPosition.y){
                if(target.charPosition.y >= this.mainCharStat.charPosition.y){
                    target.charPosition.y -= target.wlkSpd
                }else if(target.charPosition.x <= this.mainCharStat.charPosition.y){
                    target.charPosition.y += target.wlkSpd
                }
            }

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

        this.moveChar = (contex)=>{ //much public contex yes, very secure /s

            if (this.otherVar.boardKeyState.downJ === true && this.mainCharStat.appearance.resetAfterFinish === false){ //false prevent this from excuting many time

                switch(this.mainCharStat.moveSet){
                    case 1:
                        this.playSprite("charAtk2","mainCharStat")
                        this.mainCharStat.moveSet += 1
                        this.mainCharStat.stat.knockBack = 40
                    break;
                    case 2:
                        this.playSprite("charAtk3","mainCharStat")
                        this.mainCharStat.moveSet += 1
                        this.mainCharStat.stat.knockBack = 10
                        this.mainCharStat.stat.atk = 20
                    break;
                    default: //aka case 0
                        this.playSprite("charAtk1","mainCharStat")
                        this.mainCharStat.moveSet = 1 //since you just played case 0, set case to 1
                        this.mainCharStat.stat.knockBack = 10
                        this.mainCharStat.stat.atk = 10
                }

                this.collisionDetection(contex)
            
                
            }else if(this.otherVar.boardKeyState.downK === true){
                this.playSprite("charBlock","mainCharStat")
                
            }else if(this.otherVar.boardKeyState.downL === true){
                this.playSprite("charAtk2","mainCharStat")
                
                if(this.state.charMp>=50 && this.mainCharStat.stat.Lcharge === 0){
                    this.setState({"charMp":this.state.charMp - 50}) 
                    this.mainCharStat.stat.Lcharge += 1
                }
                if(this.state.charMp > 3 && this.mainCharStat.stat.Lcharge >= 1){
                    this.mainCharStat.stat.Lcharge += 1 //charge up atk (check for Lkey = false and Lcharge value)
                    this.setState({"charMp":this.state.charMp - 3})
                }
                

                //console.log(this.mainCharStat.stat.Lcharge)

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
                    (v.appearance.frame % v.appearance.totalFrame)*128,    //sx
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

        this.moveMobs =()=>{
            this.arrayOfMobs.forEach((v,i)=>{
                v.behavior(v)
            })

            this.arrayOfProjectiles.forEach((v,i)=>{
                v.behavior(v)
            })
        }

        this.appendProjectile = (canvasContex)=>{
            this.arrayOfProjectiles.forEach((v,i)=>{
                canvasContex.drawImage(
                    v.appearance.sprite.img,   
                    v.charPosition.x,    
                    v.charPosition.y,    
                    128,    
                    128,     
                    )
                //console.log(v)
            })
        }

        this.showHitBox = (ctx)=>{ //will crash if you kill a mob, there isnt a null check
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "red";
            ctx.rect(this.mainCharStat.charPosition.x,this.mainCharStat.charPosition.y,128,128)//draw main char hitbox (not actually hit box, but is hit box if you put in the same value as collision Detection.)
            ctx.rect(this.arrayOfMobs[0].charPosition.x,this.arrayOfMobs[0].charPosition.y,128,128)
            ctx.stroke();
        }

        this.collisionDetection = (contex)=>{ //assume 128^2
            //check for collison if charCenter.x + 64 > mob x or charCenter.x - 64 < mob x + 128, then check the same for y
            this.arrayOfMobs.forEach((v,i)=>{
                if(v.charPosition.x < this.mainCharStat.charPosition.x + 128 && v.charPosition.x+128 > this.mainCharStat.charPosition.x){//x works fine
                    //console.log("x hit")
                    if(v.charPosition.y < this.mainCharStat.charPosition.y + 128 && v.charPosition.y+128 > this.mainCharStat.charPosition.y){
                        //console.log("y hit")
                        v.hp -= this.mainCharStat.stat.atk
                        //console.log(v.hp)

                        if(v.knockResistance < this.mainCharStat.stat.knockBack){
                            v.charPosition.x += this.mainCharStat.stat.knockBack - v.knockResistance
                        }

                       
                        contex.drawImage(this.otherVar.wound,
                            v.charPosition.x-32-Math.floor(Math.random()*32), 
                            v.charPosition.y+32+Math.floor(Math.random()*32),
                            128+Math.floor(Math.random()*128),
                            32+Math.floor(Math.random()*32)
                        )

                        //restore block capablitiy
                        if(this.state.charDef <3){
                            this.setState({"charDef":this.state.charDef+1})
                        }

                        if(this.state.charMp < 250){ //recover mp when attacking
                            this.setState({"charMp":this.state.charMp+5})
                        }
                        this.setState({"mobBeingHit":v})
                        console.log(this.state.mobBeingHit)
                    }
                    //not colliding
                    
                }

            })
        }

        this.clearDeadMob = () => {
            this.arrayOfMobs.forEach((v,i)=>{
                if (v.hp <= 0){
                    this.arrayOfMobs.splice(i,1)
                    
                    if(this.state.mobBeingHit === v){
                        this.setState({"mobBeingHit":null})
                    }
                }
            })

            this.arrayOfProjectiles.forEach((v,i)=>{
                if (v.hp <= 0){
                    this.arrayOfProjectiles.splice(i,1)
                }
            })

            if(!this.otherVar.levelCompleted && this.arrayOfMobs.length===0){
                this.otherVar.levelCompleted = true

            }//next level avaliable

        }

        this.nextLevel=()=>{
            if(this.mainCharStat.charPosition.x > 700-128 && this.mainCharStat.charPosition.x < 700){//x works fine
                if(this.mainCharStat.charPosition.y < 250 + 32 && this.mainCharStat.charPosition.y > 250-32){
                    //console.log("gg") move to next level

                    this.otherVar.currentLevel += 1
                    this.otherVar.levelCompleted = false
                    this.mainCharStat.charPosition.x = 0
                    this.mainCharStat.charPosition.y = 250
                    this.arrayOfProjectiles = []
                    //spawn mobs

                    if(this.otherVar.currentLevel < this.levels.length){
                        this.levels[this.otherVar.currentLevel].forEach((v,i)=>{
                            this.MakeMob(v.mob,v.posX,v.posY)
                        })
                    }else{
                        alert("um, so like you finished all the levels, and like I'm like lazy, look here oldsport I took AP chem today, and Im not sure If is submitted correctly, so pardon my alert(), setting you back to level 0 please stand by...")
                        this.otherVar.currentLevel = 0
                        this.nextLevel()
                    }

                }
            }
        }

        this.checkForMobDie = ()=>{}
        //--------Mob constructor------------
        this.MakeMob = (mobType,spawnX,spawnY)=>{
            let mob = {}
            mob.name = mobType
            mob.maxHp = this.mobStat[mobType].hp
            mob.hp = this.mobStat[mobType].hp
            mob.atk = this.mobStat[mobType].atk
            mob.wlkSpd = this.mobStat[mobType].wlkSpd
            mob.skills = this.mobStat[mobType].skills
            mob.knockResistance = this.mobStat[mobType].knockResistance
            mob.cd = this.mobStat[mobType].cd
            mob.atkCd = 0

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

            mob.behavior = this.mobStat[mobType].behavior
            
            //exceptions
            if(mobType==="madMan"){
                mob.hasJumped = false
            }

            // console.log(mob)
            //push mob in the array that stores mobs
            this.arrayOfMobs.push(mob)
            console.log(this.arrayOfMobs)
        }

        this.makeProjectile = (mobType,spawnX,spawnY)=>{ //yes. mobtype, its stored in mobstat
            let Projectile = {}
            Projectile.hp = this.mobStat[mobType].hp
            Projectile.name = mobType
            Projectile.atk = this.mobStat[mobType].atk
            Projectile.wlkSpd = this.mobStat[mobType].wlkSpd

            Projectile.sprites = this.mobStat[mobType].sprites

            Projectile.charPosition = {}
            Projectile.charPosition.x = spawnX
            Projectile.charPosition.y = spawnY
            Projectile.charPosition.flip = false
        
            Projectile.appearance = {}
            Projectile.appearance.sprite = Projectile.sprites
            Projectile.behavior = this.mobStat[mobType].behavior

            //exceptions
            if(mobType==="swordWave"){
                Projectile.hp += Math.floor(this.mainCharStat.stat.Lcharge*1)
                this.mainCharStat.stat.Lcharge = 0
            }

            this.arrayOfProjectiles.push(Projectile)
        }

        //-------------------------
        let contx

        window.onload = ()=>{
            console.log(this.myRef)
            contx = this.myRef.current.getContext("2d")
            // console.log( contx)

            this.myRef.current.height = 500//700
            this.myRef.current.width = 700//900

            //this.MakeMob("greenBoi",200,200)
        }

        setInterval(()=>{ //<------stuff are done here, since this is what redraws the canvas every so often
            //console.log(typeof contx) //<-- prints 2 things 1. the actual canvas obj 2. undefine ???

            if(typeof contx !== 'undefined'){ //<--- 'filters out' the above
                contx.clearRect(0,0,700,500)//-contx.width,contx.height)

                //console.log(contx)

                if(this.otherVar.levelCompleted){ //show arrow move to next level
                    contx.drawImage(
                        this.otherVar.arrow,    //image
                        700-128,
                        250,
                        128,
                        128
                        )
                        this.nextLevel()

                }

                contx.drawImage( //draws player
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
                
                //makeSwordWave
                if (this.mainCharStat.stat.Lcharge > 0 && this.otherVar.boardKeyState.downL === false){
                    //biu biu biu
                    this.makeProjectile("swordWave",this.mainCharStat.charPosition.x,this.mainCharStat.charPosition.y)
                    this.mainCharStat.stat.Lcharge = 0

                    //console.log("created wave"+this.mainCharStat.stat.Lcharge)
                }

                this.appendProjectile(contx)
                this.appendMob(contx) //move mob moves the mob
                this.moveMobs() //is in charge mob behavior, doesn't move the mob
                this.moveChar(contx) //moves charactor
                    //console.log(this.mainCharStat.appearance.frame % this.mainCharStat.appearance.totalFrame)
                this.checkForReset("mainCharStat") // check if the animation should reset to default animation

                //this.showHitBox(contx)
                //console.log(this.state.charHp, this.mainCharStat.stat.maxhp)

                if (this.state.charHp <= 0){
                    this.mainCharStat.wlkSpd = 0
                    this.mainCharStat.appearance.sprite=this.sprites.charDied.img
                    this.mainCharStat.appearance.totalFrame=this.sprites.charDied.totalFrame
                }

                this.clearDeadMob()
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
       <div className="canholder">

            <Targetbar target={this.state.mobBeingHit}/>
            {/* <canvas className="can" ref={(c) => this.canvasContext = c.getContext('2d')}/> */}
            <canvas className="can" ref={this.myRef} onLoad={()=>console.log("loaded")} />
            {/* <button onClick={()=>this.setUpCanvasAndDrawPicture()}>aaa</button> */}
            {/* use below div to test if path is good */}
            {/* <img src="../../../pictures/walkSprite.png"></img> */}
            {/* <h1>aaaa{this.state.a}</h1> */}
            <SelfBar 
                def={this.state.charDef} 
                hp={this.state.charHp} 
                mp={this.state.charMp}
                mhp={this.mainCharStat.stat.maxhp}
                mmp={this.mainCharStat.stat.maxmp}
            />

        </div>
    )}

    
    
}