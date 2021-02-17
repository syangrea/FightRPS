

export default class MoveListener{

    constructor(player){

        this.player = player;
        this.currentMove = {
            rock: false,
            paper: false,
            scissor: false
        }
    }

    update(){
        // 
       
                    
        switch(this.player.currentMove._clip.name){
            case "punch":
                if(this.player.currentMove.time > .1 && this.player.currentMove.time < 1){
                    this.currentMove.rock = true;
                }else{
                    this.currentMove.rock = false;
                    this.currentMove.paper = false;
                    this.currentMove.scissor = false;
                }
                break;
            case "stab":
                if(this.player.currentMove.time > .25 && this.player.currentMove.time < 1){
                    this.currentMove.scissor = true;
                }else{
                    this.currentMove.rock = false;
                    this.currentMove.paper = false;
                    this.currentMove.scissor = false;
                }
                break;
            case "block_idle":
                if(this.player.currentMove.time > .01 && this.player.currentMove.time < 1){
                    this.currentMove.paper = true;
                }else{
                    this.currentMove.rock = false;
                    this.currentMove.paper = false;
                    this.currentMove.scissor = false;
                }
                break;
            default:
                this.currentMove.rock = false;
                this.currentMove.paper = false;
                this.currentMove.scissor = false;
        }
        if(this.player.attacksLeft > 0){

            if(this.currentMove.rock){
                
                if(this.player.playerNumber === "player1"){
                    this.player.moves["rock"].position.set(this.player.character.position.x + 1.5, 1.5, -.5);
                }else if (this.player.playerNumber === "player2"){
                    this.player.moves["rock"].position.set(this.player.character.position.x - 1.5, 1.5, -.5);
                }
                
                
                this.player.currentRPSMove = "rock";
            }else if(this.currentMove.paper){
           
                if(this.player.playerNumber === "player1"){
                    this.player.moves["paper"].position.set(this.player.character.position.x + 1, 1.5, 0);
                }else if (this.player.playerNumber === "player2"){
                    this.player.moves["paper"].position.set(this.player.character.position.x - 1, 1.5, 0);
                }     
                
                
                this.player.currentRPSMove = "paper";       
            }else if(this.currentMove.scissor){
               
                if(this.player.playerNumber === "player1"){
                    
                    this.player.moves["scissor"].position.set(this.player.character.position.x + 1, 1.5, 0);
                    
                    
                }else if (this.player.playerNumber === "player2"){
                    this.player.moves["scissor"].position.set(this.player.character.position.x - 1, 1.5, 0);
                }  
                
                
                this.player.currentRPSMove = "scissor";          
            }else{
                this.player.moves["rock"].position.set(10, 3, 0);
                this.player.moves["paper"].position.set(10, 3, 0);
                this.player.moves["scissor"].position.set(10, 3, 0);
                this.player.currentRPSMove = null;
            }
            
            
        }else{
                this.player.moves["rock"].position.set(10, 3, 0);
                this.player.moves["paper"].position.set(10, 3, 0);
                this.player.moves["scissor"].position.set(10, 3, 0);
                this.player.currentRPSMove = null;
        }
    }

}