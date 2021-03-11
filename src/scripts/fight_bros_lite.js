import * as THREE from 'three';
import '../styles/index.scss'
import CollisionManager from './collision_manager';
import MoveLoader from './move_loader';
import PlayerLoader from './players_loader';
import UIManager from './ui_manager';


const CHARACTERS = [
    "capoeira_girl"
]

const MOVES = [
    "rock", "paper", "scissor"
]


export default class FightBrosLite{

    constructor(players, container){
        this.players = players;
        this.container = container;
        this.currentScreen;
        this.clock;
        this.camera;
        this.scene;
        this.charactersLoaded = false;
        this.collisionManager;
        this.movesLoaded = false;
        this.loadedMoves;
        this.winner = null;
        this.gamePaused = false;
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.createStartScreen();
    }

    initGame(){
        this.container.removeChild(this.currentScreen);
        let gameCanvas = document.createElement("div");
        gameCanvas.setAttribute("id", "game-canvas")
        this.container.appendChild(gameCanvas);
        this.currentScreen = gameCanvas;
        //init clock
        this.clock = new THREE.Clock();
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.initPauseUI();
        const playerLoader = new PlayerLoader(CHARACTERS, this.players, this.scene, this.gamePaused);
        playerLoader.load(() => {
            this.charactersLoaded = true;
        })

        const moveLoader = new MoveLoader(MOVES, this.scene, this.players);
        moveLoader.loadMoves(() => {
            this.movesLoaded = true;
        })
        this.uiManager = new UIManager(this.players, this.currentScreen);
        this.uiManager.initializeDom();
        this.collisionManager = new CollisionManager(this.players);
        window.addEventListener( 'resize', this.onWindowResize );
        this.loadLoadingScreen();
        this.animate();
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        let renderer = this.renderer;
       	renderer.setPixelRatio( window.devicePixelRatio );
    	renderer.setSize( window.innerWidth, window.innerHeight );
    	renderer.outputEncoding = THREE.sRGBEncoding;
    	renderer.shadowMap.enabled = true;

    	this.currentScreen.appendChild( renderer.domElement );
    }

    initCamera(){
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	    this.camera.position.set( 0, 1, 5);
    }

    initScene(){
        this.scene = new THREE.Scene();
        let scene = this.scene;
        let stageLoader = new THREE.TextureLoader();
        const backgroundImage = stageLoader.load('./images/background_arena.jfif');
        backgroundImage.encoding = THREE.sRGBEncoding;
        backgroundImage.center.y = 0.8;
        scene.background = backgroundImage;

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	    hemiLight.position.set( 0, 20, 0 );
	    this.scene.add( hemiLight );

	    const dirLight = new THREE.DirectionalLight( 0xffffff );
	    dirLight.position.set( - 5, 10, - 5 );
	    dirLight.castShadow = true;

	    this.scene.add( dirLight );

        
        const groundTexture = stageLoader.load('./images/grass.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25,25);
        groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;

        const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
        
	    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100,50,10,10 ), groundMaterial );
	    mesh.rotation.x = - Math.PI / 2;
	    mesh.receiveShadow = true;
	    mesh.updateMatrixWorld(true);
	    // this.scene.add( mesh );

        

    }

    initPauseUI(){
        let pauseDiv = document.createElement("div");
        this.currentScreen.appendChild(pauseDiv);
        pauseDiv.setAttribute('id',"pause-container")
        let buttonHeader = document.createElement("div");
        pauseDiv.appendChild(buttonHeader);
        buttonHeader.innerText = "Pause for instructions";
        let pauseButton = document.createElement("button");
        let pauseImage = document.createElement("img");
        pauseImage.setAttribute("src", "https://raw.githubusercontent.com/syangrea/FightRPS/main/images/pause_button.png")
        pauseButton.appendChild(pauseImage);
        pauseDiv.appendChild(pauseButton);

        pauseButton.addEventListener("click", () => {
            this.gamePaused = true;
            this.addInstructionsModal();
        })
    } 

    addInstructionsModal(){
        let modal = document.createElement("div");
        this.currentScreen.appendChild(modal);
        modal.setAttribute("id", "instruction-modal");
        let childModal = document.createElement("div");
        modal.appendChild(childModal);
        childModal.setAttribute("id", "instruction-modal-child");
        let closeButton = document.createElement("button");
        closeButton.innerText = "✕";
        closeButton.setAttribute("id", "instruction-modal-close");
        childModal.appendChild(closeButton);
        let header = document.createElement("h1");
        childModal.appendChild(header);
        header.innerText = "Instructions";
        let intro = document.createElement("div");
        childModal.appendChild(intro);
        intro.innerText = "This is a 3D version of Rock, Papers, Scissors. The objective is to beat your opponents three times. What makes this 3D is that you can move left and right and the timing of your move (rock,papers,scissors matters).";
        let instructionsList = document.createElement("ul");
        childModal.appendChild(instructionsList);
        let li1 = document.createElement("li");
        instructionsList.appendChild(li1);
        li1.innerText = "Each round, players starts with three moves. Playing a rock,papers, or scissors expends a move, but moving left and right doesn't.";
        let li2 = document.createElement("li");
        instructionsList.appendChild(li2);
        li2.innerText = "A round ends and players restart at their starting positions when either both players have no moves left or one player has beat the other.";
        let li3 = document.createElement("li");
        instructionsList.appendChild(li3);
        li3.innerText = "You beat the opponent if you play your move within your move's attack range and they either aren't playing a move at all at the moment or their current move is one that loses to yours. Which moves beats which follows the original Rock, Papers, Scissors game logic.";

        closeButton.addEventListener("click", () => {
            this.gamePaused = false;
            this.currentScreen.removeChild(modal);
        })


    }

    

    onWindowResize() {
        if(window.innerWidth > 1000){

            this.camera.aspect = window.innerWidth / window.innerHeight;
        }else{
            this.camera.aspect = window.innerHeight / window.innerWidth;
        }
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate(){
        let reqId = requestAnimationFrame(this.animate);
        let delta = this.clock.getDelta();
        if(this.charactersLoaded && this.movesLoaded && !this.gamePaused){
            if(this.loadingScreen) {
                this.deleteLoadingScreen();
            }
            let noAttacksLeft = 0;
            Object.values(this.players).forEach(player => {
                // player.mixer.update(delta);
                // debugger
                
                if(player.playerNumber === 'player2' && !player.controller.input.startedInterval){
                    player.controller.input.startActions();
                }
                if(player.attacksLeft === 0 ){
                    noAttacksLeft += 1;
                }
                if(player.dead){
                    this.winner = (player.playerNumber === "player1") ? "player2" : "player1";
                    window.cancelAnimationFrame(reqId);
                    this.gameOver();
                }
                if(noAttacksLeft === 2){

                    this.restartRound();
                    
                }
                if(player.hitAndRoundFinished){
                    this.restartRound();
                }

                
                player.listener.update(delta);
                
            })
            this.collisionManager.updateCollisions();
            this.uiManager.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    loadLoadingScreen(){
        this.loadingScreen = document.createElement('div');
        this.container.appendChild(this.loadingScreen);
        this.loadingScreen.setAttribute('id', 'loading-screen')
        let loadingContainer = document.createElement('div');
        loadingContainer.setAttribute('id','loading-container')
        this.loadingScreen.appendChild(loadingContainer)
        loadingContainer.innerText = "loading";
        this.deletedLoading = false;
        this.loadingDotInterval = setInterval(() => {
            switch(loadingContainer.innerText){
                case "loading .":
                    loadingContainer.innerText = 'loading ..';
                    break;
                case "loading ..":
                    loadingContainer.innerText = 'loading ...';
                    break;
                case "loading ...":
                    loadingContainer.innerText = 'loading';
                    break;
                case "loading":
                    loadingContainer.innerText = 'loading .';
                    break;
            }
        }, 300)
    }

    deleteLoadingScreen(){
        if(this.deletedLoading) return;
        this.loadingScreen.classList.add('deleting');
        let that = this;
        this.deletedLoading = true;
        setTimeout(() => {
            debugger
            that.container.removeChild(that.loadingScreen);
            that.loadingScreen = null;
        },5)
        clearInterval(this.loadingDotInterval)
    }

    createStartScreen(){
        if(this.currentScreen){
            this.charactersLoaded = false;
            this.movesLoaded = false;
            this.winner = null;
            this.uiManager.initializeDom();
            this.container.removeChild(this.currentScreen);

        }
        let startScreen = document.createElement('div');
        startScreen.setAttribute('id', 'start-screen');
        this.container.appendChild(startScreen);
        let startContainer = document.createElement('div');
        startContainer.setAttribute('id', 'start-container');
        startScreen.appendChild(startContainer);
        let startHeader = document.createElement('h1');
        startHeader.innerText = 'Welcome to 3D Rock Papers Scissors';
        startContainer.appendChild(startHeader);
        let startButton = document.createElement('button');
        startButton.innerText = "Play";
        startContainer.appendChild(startButton);
        this.currentScreen = startScreen;

        let linksContainer = document.createElement('div');
        linksContainer.setAttribute('id', 'links-container');
        startScreen.appendChild(linksContainer);

        let linkHeader = document.createElement('h1');
        linkHeader.innerText = 'Stephen Yang - Links';
        linksContainer.appendChild(linkHeader);

        let linksList = document.createElement('div');
        linksList.setAttribute('id', 'links-list');
        linksContainer.appendChild(linksList);

        let linkedInLink = document.createElement('a');
        linkedInLink.setAttribute('href', "https://www.linkedin.com/in/syangrea/");
        linkedInLink.setAttribute('target', "_blank");
        linkedInLink.setAttribute('rel', "noopener noreferrer");
        let linkedInImg = document.createElement('img');
        linkedInImg.setAttribute('src', 'https://raw.githubusercontent.com/syangrea/FightRPS/main/images/linkedIn.png');
        linkedInLink.appendChild(linkedInImg);
        linkedInLink.setAttribute('class', 'link-item');


        let githubLink = document.createElement('a');
        githubLink.setAttribute('href', "https://github.com/syangrea");
        githubLink.setAttribute('target', "_blank");
        githubLink.setAttribute('rel', "noopener noreferrer");
        let githubImg = document.createElement('img');
        githubImg.setAttribute('src', 'https://raw.githubusercontent.com/syangrea/FightRPS/main/images/github.png');
        githubLink.appendChild(githubImg);
        githubLink.setAttribute('class', 'link-item');


        let angelListLink = document.createElement('a');
        angelListLink.setAttribute('href', "https://angel.co/u/stephen-yang-8")
        angelListLink.setAttribute('target', "_blank")
        angelListLink.setAttribute('rel', "noopener noreferrer")
        let angelListImg = document.createElement('img');
        angelListImg.setAttribute('src', 'https://raw.githubusercontent.com/syangrea/FightRPS/main/images/angellist.png');
        angelListLink.appendChild(angelListImg);
        angelListLink.setAttribute('class', 'link-item');
        
        let portfolioLink = document.createElement('a');
        portfolioLink.setAttribute('href', "https://syangrea.github.io/")
        portfolioLink.setAttribute('target', "_blank")
        portfolioLink.setAttribute('rel', "noopener noreferrer")
        let portfolioImg = document.createElement('img');
        portfolioImg.setAttribute('src', 'https://raw.githubusercontent.com/syangrea/FightRPS/main/images/angellist.png');
        portfolioLink.appendChild(portfolioImg);
        portfolioLink.setAttribute('class', 'link-item');
        
   

        linksList.appendChild(linkedInLink);
        linksList.appendChild(githubLink);
        linksList.appendChild(angelListLink);

        startButton.addEventListener("click", (e) => {
            
            this.initGame();
        })  
    }

    gameOver(){
        this.container.removeChild(this.currentScreen);
        let gameOverScreen = document.createElement('div');
        gameOverScreen.setAttribute("id", "game-over-screen");
        this.container.appendChild(gameOverScreen);
        let gameOverContainer = document.createElement('div');
        gameOverContainer.setAttribute("id", "game-over-container");
        gameOverScreen.appendChild(gameOverContainer);
        this.currentScreen = gameOverScreen;
        let gameOverHeader = document.createElement('h1');
        gameOverHeader.innerText = `${this.winner} has won!`
        gameOverContainer.appendChild(gameOverHeader);
        let restartButton = document.createElement('button');
        restartButton.innerText = "Play Again";
        gameOverContainer.appendChild(restartButton);
        restartButton.addEventListener('click', e => {
            this.createStartScreen();
        })
    }

    restartRound(){
        Object.values(this.players).forEach(player => {
            player.attacksLeft = 3;
            player.hitAndRoundFinished = false;
            player.character.position.set(...player.initialPosition)
        })

    }
}