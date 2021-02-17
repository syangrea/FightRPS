

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

        this.generateControls();
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

    generateControls(){
        let gameControls = document.createElement('div');
        gameControls.setAttribute('id', 'game-controls-footer');
        this.container.appendChild(gameControls);

        let leftKeyButton = document.createElement('div');
        leftKeyButton.setAttribute('class', 'game-controls-key');
        let leftKeyImg = document.createElement('img');
        leftKeyImg.setAttribute('src','../../images/keyboard_key_left.png');
        leftKeyButton.appendChild(leftKeyImg);
        let leftKeyName = document.createElement('h5');
        leftKeyName.setAttribute('class','key-name');
        leftKeyName.innerText = "Move Left";
        leftKeyButton.appendChild(leftKeyName);
        gameControls.appendChild(leftKeyButton);

        let rightKeyButton = document.createElement('div');
        rightKeyButton.setAttribute('class', 'game-controls-key');
        let rightKeyImg = document.createElement('img');
        rightKeyImg.setAttribute('src','../../images/keyboard_key_right.png');
        rightKeyButton.appendChild(rightKeyImg);
        let rightKeyName = document.createElement('h5');
        rightKeyName.setAttribute('class','key-name');
        rightKeyName.innerText = "Move Right";
        rightKeyButton.appendChild(rightKeyName);
        gameControls.appendChild(rightKeyButton);

        let oneKeyButton = document.createElement('div');
        oneKeyButton.setAttribute('class', 'game-controls-key');
        let oneKeyImg = document.createElement('img');
        oneKeyImg.setAttribute('src','../../images/keyboard_key_1.png');
        oneKeyButton.appendChild(oneKeyImg);
        let oneKeyName = document.createElement('h5');
        oneKeyName.setAttribute('class','key-name');
        oneKeyName.innerText = "Scissors";
        oneKeyButton.appendChild(oneKeyName);
        gameControls.appendChild(oneKeyButton);

        let twoKeyButton = document.createElement('div');
        twoKeyButton.setAttribute('class', 'game-controls-key');
        let twoKeyImg = document.createElement('img');
        twoKeyImg.setAttribute('src','../../images/keyboard_key_2.png');
        twoKeyButton.appendChild(twoKeyImg);
        let twoKeyName = document.createElement('h5');
        twoKeyName.setAttribute('class','key-name');
        twoKeyName.innerText = "Rock";
        twoKeyButton.appendChild(twoKeyName);
        gameControls.appendChild(twoKeyButton);

        let threeKeyButton = document.createElement('div');
        threeKeyButton.setAttribute('class', 'game-controls-key');
        let threeKeyImg = document.createElement('img');
        threeKeyImg.setAttribute('src','../../images/keyboard_key_3.png');
        threeKeyButton.appendChild(threeKeyImg);
        let threeKeyName = document.createElement('h5');
        threeKeyName.setAttribute('class','key-name');
        threeKeyName.innerText = "Paper";
        threeKeyButton.appendChild(threeKeyName);
        gameControls.appendChild(threeKeyButton);

        let fourKeyButton = document.createElement('div');
        fourKeyButton.setAttribute('class', 'game-controls-key');
        let fourKeyImg = document.createElement('img');
        fourKeyImg.setAttribute('src','../../images/keyboard_key_4.png');
        fourKeyButton.appendChild(fourKeyImg);
        let fourKeyName = document.createElement('h5');
        fourKeyName.setAttribute('class','key-name');
        fourKeyName.innerText = "Dance (hold)";
        fourKeyButton.appendChild(fourKeyName);
        gameControls.appendChild(fourKeyButton);

        let fiveKeyButton = document.createElement('div');
        fiveKeyButton.setAttribute('class', 'game-controls-key');
        let fiveKeyImg = document.createElement('img');
        fiveKeyImg.setAttribute('src','../../images/keyboard_key_5.png');
        fiveKeyButton.appendChild(fiveKeyImg);
        let fiveKeyName = document.createElement('h5');
        fiveKeyName.setAttribute('class','key-name');
        fiveKeyName.innerText = "Taunt (hold)";
        fiveKeyButton.appendChild(fiveKeyName);
        gameControls.appendChild(fiveKeyButton);

        
    }

}