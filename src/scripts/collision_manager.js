

export default class CollisionManager{

    constructor(players){
        this.player1 = players["player1"];
        this.player2 = players["player2"];
    }

    updateCollisions(){
        this.checkWithinRange();
        this.checkAgainstWall();

        

        if(this.player1.currentRPSMove && this.player2.currentRPSMove){
            // debugger
            if(this.findDistance() < 3.5){

                if(this.player1.currentRPSMove === "rock"){
                    if(this.player2.currentRPSMove === "rock"){
                    }else if(this.player2.currentRPSMove === "paper"){
                        if(!this.player1.attacked) {
                            if(this.player1.health === 1){
                                this.player1.controller.switchActions('death');
                            }else{
                                this.player1.controller.switchActions('hard_hit');
                            }
                        }
                    }else if(this.player2.currentRPSMove === "scissor"){
                        debugger
                        if(!this.player2.attacked) {
                            if(this.player2.health === 1){
                                this.player2.controller.switchActions('death');
                            }else{
                                this.player2.controller.switchActions('hard_hit');
                            }
                        }
                    }
                }else if(this.player1.currentRPSMove === "paper"){
                    if(this.player2.currentRPSMove === "rock"){
                        if(!this.player2.attacked) {
                            if(this.player2.health === 1){
                                this.player2.controller.switchActions('death');
                            }else{
                                this.player2.controller.switchActions('hard_hit');
                            }
                        }
                    }else if(this.player2.currentRPSMove === "paper"){
                       
                    }else if(this.player2.currentRPSMove === "scissor"){
                        if(!this.player1.attacked) {
                            if(this.player1.health === 1){
                                this.player1.controller.switchActions('death');
                            }else{
                                this.player1.controller.switchActions('hard_hit');
                            }
                        }
                    }                    
                }else if(this.player1.currentRPSMove === "scissor"){
                    if(this.player2.currentRPSMove === "rock"){
                        if(!this.player1.attacked) {
                            if(this.player1.health === 1){
                                this.player1.controller.switchActions('death');
                            }else{
                                this.player1.controller.switchActions('hard_hit');
                            }
                        }
                    }else if(this.player2.currentRPSMove === "paper"){
                        if(!this.player2.attacked) {
                            if(this.player2.health === 1){
                                this.player2.controller.switchActions('death');
                            }else{
                                this.player2.controller.switchActions('hard_hit');
                            }
                        }
                    }else if(this.player2.currentRPSMove === "scissor"){
                    }                    
                }
            }
        }else if(this.player1.currentRPSMove){
            if(this.findDistance() < 2.5){

                if(this.player1.currentRPSMove === "paper"){
                    if(this.findDistance() <= 1.8 ){
                        if(!this.player2.attacked){
                            if(this.player2.health === 1){
                                this.player2.controller.switchActions('death');
                            }else{
                                this.player2.controller.switchActions('hard_hit');
                            }
                        }
                    }
                }else{
                    if(!this.player2.attacked) {
                            if(this.player2.health === 1){
                                this.player2.controller.switchActions('death');
                            }else{
                                this.player2.controller.switchActions('hard_hit');
                            }
                        }
                }
            }
        }else if(this.player2.currentRPSMove){
            if(this.findDistance() < 2.5){

                if(this.player2.currentRPSMove === "paper"){
                    if(this.findDistance() <= 1.8 ){
                        if(!this.player1.attacked) {
                            if(this.player1.health === 1){
                                this.player1.controller.switchActions('death');
                            }else{
                                this.player1.controller.switchActions('hard_hit');
                            }
                        }
                    }
                }else{
                    if(!this.player1.attacked) {
                        if(this.player1.health === 1){
                            this.player1.controller.switchActions('death');
                        }else{
                            this.player1.controller.switchActions('hard_hit');
                        }
                    }
                }
            }
        }
            
        
    }

    findDistance(){
        return Math.abs(this.player1.character.position.x - this.player2.character.position.x)
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