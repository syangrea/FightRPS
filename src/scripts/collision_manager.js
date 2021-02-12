

export default class CollisionManager{

    constructor(players){
        this.player1 = players["player1"];
        this.player2 = players["player2"];
    }

    updateCollisions(){
        this.checkWithinRange();
        this.checkAgainstWall();
        
        if(this.player1.collided || this.player2.collided){
            
            if(this.player1.currentMove._clip.name === "attack1.001" ){
                
                if(this.player2.currentMove._clip.name !== "block_idle"){
                    debugger
                    this.player2.controller.switchActions("soft_hit");
                }
            }else if(this.player1.currentMove._clip.name === "attack2.001" ){
                if(this.player2.currentMove._clip.name !== "block_idle"){
                    this.player2.controller.switchActions("hard_hit");
                }
            }else if(this.player2.currentMove._clip.name === "attack1.001" ){
                if(this.player1.currentMove._clip.name !== "block_idle"){
                    this.player1.controller.switchActions("soft_hit");
                }
            }else if(this.player1.currentMove._clip.name === "attack2.001" ){
                if(this.player1.currentMove._clip.name !== "block_idle"){
                    this.player1.controller.switchActions("hard_hit");
                }
            }
        }
    }

    checkWithinRange(){
        if(Math.abs(this.player1.character.position.x - this.player2.character.position.x) <= 1.2 ){
            this.player1.collided = true;
            this.player2.collided = true;
        }else{
            this.player1.collided = false;
            this.player2.collided = false;
        }
    }

    checkAgainstWall(){
        if(this.player1.character.position.x < -3.5){
            this.player1.againstLeftWall = true;
        }else if(this.player1.character.position > 3.5){
            this.player1.againstRightWall = true;
        }else{
            this.player1.againstLeftWall = false;
            this.player1.againstRightWall = false;
        }
        if(this.player2.character.position < -3.5){
            this.player2.againstLeftWall = true;
        }else if(this.player2.character.position > 3.5){
            this.player2.againstRightWall = true;
        }else{
            this.player2.againstLeftWall = false;
            this.player2.againstRightWall = false;
        }
    }

    

}