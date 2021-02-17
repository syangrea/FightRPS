

export default class UIManager{

    constructor(players, container){
        this.players = players;
        this.container = container;
        this.loaded = false;
        this.canvasUIHeader;
    }

    initializeDom(){
        this.canvasUIHeader = document.createElement('div');
        this.canvasUIHeader.setAttribute('id', 'game-header');
        this.container.appendChild(this.canvasUIHeader);
        if(this.loaded){
            this.container.childNodes.forEach(childNode => {
                this.container.removeChild(childNode);
            })
        }
        Object.values(this.players).forEach(player => {
            this.initPlayerUI(player);
        })
        this.loaded = true;
    }

    initPlayerUI(player){
        let playerUi = document.createElement('div');
        playerUi.setAttribute('id',`${player.playerNumber}-ui`);
        playerUi.setAttribute('class','player-ui');
        this.canvasUIHeader.appendChild(playerUi);
        let playerPic = document.createElement('img');
        playerPic.setAttribute('class','player-pic');
        playerPic.setAttribute('src',`../../images/${player.modelName}.PNG`)
        let playerName = document.createElement('h1');
        playerName.setAttribute('class','player-name');
        playerName.innerText = player.playerNumber;
        let playerStats = document.createElement('div');
        playerStats.setAttribute('class','player-stats');
        
        let playerHealth = document.createElement('div');
        playerHealth.setAttribute('class','player-health');
        let playerAttacksLeft = document.createElement('div');
        playerAttacksLeft.setAttribute('class','attacks-left');
        playerUi.appendChild(playerPic);
        playerUi.appendChild(playerName);
        playerUi.appendChild(playerStats);
        playerStats.appendChild(playerHealth);
        playerStats.appendChild(playerAttacksLeft);
        for(let i = 0; i < 3; i++){
            let health = document.createElement('img');
            health.setAttribute('src','../../images/health.png');
            playerHealth.appendChild(health);
        }
        for(let i = 0; i < 3; i++){
            let attack = document.createElement('img');
            attack.setAttribute('src','../../images/swords.png');
            playerAttacksLeft.appendChild(attack);
        }
    }

    update(){
        Object.values(this.players).forEach(player => {
            let playerUi = document.getElementById(`${player.playerNumber}-ui`)
            
            let playerHealth = playerUi.getElementsByClassName('player-health')[0];
            let playerAttacksLeft = playerUi.getElementsByClassName('attacks-left')[0];
            
            if(player.health !== playerHealth.childNodes.length && playerHealth.childNodes.length !== 0){
                playerHealth.removeChild(playerHealth.childNodes[playerHealth.childNodes.length-1]);
            }
            if(player.attacksLeft !== playerAttacksLeft.childNodes.length){
                if(player.attacksLeft < 0){

                }else if(player.attacksLeft < playerAttacksLeft.childNodes.length){
                    
                    playerAttacksLeft.removeChild(playerAttacksLeft.childNodes[playerAttacksLeft.childNodes.length-1]);
                }else{
                    let attack = document.createElement('img');
                    attack.setAttribute('src','../../images/swords.png');
                    playerAttacksLeft.appendChild(attack);
                }
            }
        })
    }

}