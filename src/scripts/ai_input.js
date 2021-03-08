

export default class AiInput{
    constructor(switchActions){
        this.switchActions = switchActions;
        this.startedInterval;
        this.startActions = this.startActions.bind(this);
    }
 
    startActions(){
        

        let attacks = ["stab", "punch", "block_idle", "walk", "walk_backwards.001"]
        this.startedInterval = setInterval(() => {
            let nextMove = attacks[Math.floor(Math.random() * 5)]
            if(nextMove === "walk" || nextMove === "walk_backwards.001"){
                this.switchActions(nextMove);
                clearInterval(this.startedInterval);
                setTimeout(()=> {
                    this.switchActions("idle");
                    this.startActions();
                }, 1000)
            }else{

                this.switchActions(nextMove)
            }
            // this.switchActions(attacks[Math.floor(Math.random() * 3)])

        }, 8000)
       
    }



    
}