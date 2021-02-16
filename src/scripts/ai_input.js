

export default class AiInput{
    constructor(switchActions){
        this.switchActions = switchActions;
        this.startedInterval;
        this.startActions = this.startActions.bind(this);
    }
 
    startActions(){
        

        let attacks = ["stab", "punch", "block_idle"]
        this.startedInterval = setInterval(() => {

            this.switchActions(attacks[Math.floor(Math.random() * 3)])
        }, 5000)
       
    }


    
}