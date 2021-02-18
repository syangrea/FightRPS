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

        const playerLoader = new PlayerLoader(CHARACTERS, this.players, this.scene);
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

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate(){
        let reqId = requestAnimationFrame(this.animate);
        let delta = this.clock.getDelta();
        if(this.charactersLoaded && this.movesLoaded){
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
        linkHeader.innerText = 'Links';
        linksContainer.appendChild(linkHeader);

        let linksList = document.createElement('div');
        linksList.setAttribute('id', 'links-list');
        linksContainer.appendChild(linksList);

        let linkedInLink = document.createElement('a');
        linkedInLink.setAttribute('href', "https://www.linkedin.com/in/syangrea/");
        let linkedInImg = document.createElement('img');
        linkedInImg.setAttribute('src', '../../images/linkedIn.png');
        linkedInLink.appendChild(linkedInImg);
        linkedInLink.setAttribute('class', 'link-item');


        let githubLink = document.createElement('a');
        githubLink.setAttribute('href', "https://github.com/syangrea");
        let githubImg = document.createElement('img');
        githubImg.setAttribute('src', '../../images/github.png');
        githubLink.appendChild(githubImg);
        githubLink.setAttribute('class', 'link-item');


        let angelListLink = document.createElement('a');
        angelListLink.setAttribute('href', "https://angel.co/u/stephen-yang-8")
        let angelListImg = document.createElement('img');
        angelListImg.setAttribute('src', '../../images/angellist.png');
        angelListLink.appendChild(angelListImg);
        angelListLink.setAttribute('class', 'link-item');
   

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