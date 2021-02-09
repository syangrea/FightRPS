import "./styles/index.scss";
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera, clock;
let model, skeleton, mixer;
let model2, skeleton2, mixer2;

let attackOneAction, attackTwoAction, 
    blockIdleAction, blockStartAction, blockImpactAction, 
    walkAction, walkBackwardAction, 
    softHitAction, hardHitAction, deathAction, 
    idleAction, tauntAction, danceAction;

let attackOneAction2, attackTwoAction2, 
    blockIdleAction2, blockStartAction2, blockImpactAction2, 
    walkAction2, walkBackwardAction2, 
    softHitAction2, hardHitAction2, deathAction2, 
    idleAction2, tauntAction2, danceAction2;


let actions;
let actions2;

let activatedAction;
let activatedAction2;

init();

function init() {
	const container = document.createElement( 'div' );
    container.setAttribute("id", "fight-canvas");
    document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 1, 2, - 3 );
    camera.lookAt( 0, 1, 0 );

	clock = new THREE.Clock();
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xa0a0a0 );
	
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( - 3, 10, - 10 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	scene.add( dirLight );
	// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    //background
    const stageLoader = new THREE.TextureLoader();
    const backgroundTexture = stageLoader.load("./images/background.jpg");
    scene.background = backgroundTexture

	// ground
    const groundTexture = stageLoader.load('./images/grass.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25,25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
    
	const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000,20000 ), groundMaterial );
	mesh.position.y = -350;
    mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );


	const loader = new GLTFLoader();
	loader.load( './models/capoeira/capoeira_girl.glb', function ( gltf ) {
		model = gltf.scene;
		scene.add( model );
		model.traverse( function ( object ) {
			if ( object.isMesh ) object.castShadow = true;
		} );
		//
		skeleton = new THREE.SkeletonHelper( model );
		skeleton.visible = false;
		scene.add( skeleton );
		//
		
		//
		const animations = gltf.animations;
		mixer = new THREE.AnimationMixer( model );
		attackOneAction = mixer.clipAction( animations[ 0 ] );
		attackTwoAction = mixer.clipAction( animations[ 1 ] );
		blockIdleAction = mixer.clipAction( animations[ 2 ] );
        blockImpactAction = mixer.clipAction( animations[3]);
        blockStartAction = mixer.clipAction( animations[4]);
        danceAction = mixer.clipAction( animations[5]);
        deathAction = mixer.clipAction( animations[6]);
        hardHitAction = mixer.clipAction( animations[7]);
        idleAction = mixer.clipAction( animations[8]);
        softHitAction = mixer.clipAction( animations[9]);
        tauntAction = mixer.clipAction( animations[10]);
        walkBackwardAction = mixer.clipAction( animations[11]);
        walkAction = mixer.clipAction( animations[12]);


		actions = [ attackOneAction, attackTwoAction, 
            blockIdleAction, blockImpactAction, blockStartAction,
            walkAction, walkBackwardAction,
            deathAction, softHitAction, hardHitAction,
            danceAction, tauntAction, idleAction
        ];

        activateAction(idleAction,1);
		
		animate();
	} );
	loader.load( './models/capoeira/capoeira_girl.glb', function ( gltf ) {
		model2 = gltf.scene;
		scene.add( model2 );
		model2.traverse( function ( object ) {
			if ( object.isMesh ) object.castShadow = true;
		} );
		//
		skeleton2 = new THREE.SkeletonHelper( model2 );
		skeleton2.visible = false;
		scene.add( skeleton2 );
		//
		
		//
		const animations = gltf.animations;
		mixer2 = new THREE.AnimationMixer( model2 );
		attackOneAction2 = mixer2.clipAction( animations[ 0 ] );
		attackTwoAction2 = mixer2.clipAction( animations[ 1 ] );
		blockIdleAction2 = mixer2.clipAction( animations[ 2 ] );
        blockImpactAction2 = mixer2.clipAction( animations[3]);
        blockStartAction2 = mixer2.clipAction( animations[4]);
        danceAction2 = mixer2.clipAction( animations[5]);
        deathAction2 = mixer2.clipAction( animations[6]);
        hardHitAction2 = mixer2.clipAction( animations[7]);
        idleAction2 = mixer2.clipAction( animations[8]);
        softHitAction2 = mixer2.clipAction( animations[9]);
        tauntAction2 = mixer2.clipAction( animations[10]);
        walkBackwardAction2 = mixer2.clipAction( animations[11]);
        walkAction2 = mixer2.clipAction( animations[12]);


		actions2 = [ attackOneAction2, attackTwoAction2, 
            blockIdleAction2, blockImpactAction2, blockStartAction2,
            walkAction2, walkBackwardAction2,
            deathAction2, softHitAction2, hardHitAction2,
            danceAction2, tauntAction2, idleAction2
        ];

        activateAction(idleAction2, 2);
		
		animate();
	} );

    
    
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );
    
}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))
function activateAction( action, playerNum) {
	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( 1 );
    action.play();
    if(playerNum === 1) activatedAction = action;
    if(playerNum === 2) activatedAction2 = action;
}

function addKeyListeners(){

}




function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	
	requestAnimationFrame( animate );
	let mixerUpdateDelta = clock.getDelta();
	mixer.update( mixerUpdateDelta );
	mixer2.update( mixerUpdateDelta );
	renderer.render( scene, camera );

}