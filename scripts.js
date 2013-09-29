LEAP = {
	init: function(){
		Leap.loop(function(frame) {
			LEAP.filterData(frame);
		});		
	},
	filterData: function(frame){

		if( frame.valid ){		
			if(typeof frame.hands[0] !== "undefined" ){
				
				var hand = frame.hands[0];

				if (typeof frame.gestures[0] !== "undefined") {
					console.log(frame.gestures[0])
					if (frame.gestures[0].type == "circle") {
						console.log("circle gesture detected")
					}
				}
				

				if( frame.hands.length == 2 ){
					var hand2 = frame.hands[1];

					var hand1Center = hand.sphereCenter
					var hand2Center = hand2.sphereCenter

					var xd = hand1Center[0] - hand2Center[0]
					var yd = hand1Center[1] - hand2Center[1]
					var zd = hand1Center[2] - hand2Center[2]

					var handDistance = Math.sqrt(xd*xd + yd*yd + zd*zd)

					// console.log(handDistance)
					if (handDistance < 40) {
						STAR.blowUp = true
					}

					STAR.sphereRadius = handDistance
				}

				if( frame.hands.length == 1 ) {
					STAR.sphereRotX = STAR.Functions.setToRange( hand.rotation[0][1], [-1,1], [1,-1], STAR.sphereRotX );
					STAR.sphereRotY = STAR.Functions.setToRange( hand.rotation[1][2], [-1,1], [2.5,-2.5], STAR.sphereRotY );
					STAR.sphereRotZ = STAR.Functions.setToRange( hand.rotation[0][2], [-1,1], [-2,2], STAR.sphereRotZ );
				}

				// STAR.sphereRadius = STAR.Functions.setToRange( hand.sphereRadius, [50,180], [10,400] );

				// STAR.spherePosX = STAR.Functions.setToRange( hand.palmPosition[0], [-200,200], [-700,700], STAR.spherePosX );
				// STAR.spherePosY = STAR.Functions.setToRange( hand.palmPosition[1], [50,300], [-600,300], STAR.spherePosY );
				// STAR.spherePosZ = STAR.Functions.setToRange( hand.palmPosition[2], [-50,300], [-250,200], STAR.spherePosZ );
				
				STAR.update();
			}
		}
	}
};

STAR = {
	renderer: null,
	camera: null,
	scene: null,
	sphereRadius: 150,
	
	windowWidth: 600,
	windowHeight: 400,
	windowDepth: 600,
	
	spherePosX: 0,
	spherePosY: 0,
	spherePosZ: 0,
	
	sphereRotX: 0,
	sphereRotY: 0,
	sphereRotZ: 0,

	blowUp: false,
	
	rotationMatrix: new THREE.Matrix4(),


	
	init: function(){
		STAR.setupScene();
		STAR.addLight();
		STAR.createSphere();
		LEAP.init();
	},
	update: function(){
		if (STAR.blowUp === true) {
			STAR.blowUp();
		} else {
			STAR.createSphere();
		}
	},
	setupScene: function(){

		STAR.windowWidth	=	$(window).width(),
		STAR.windowHeight	=	$(window).height(),
		STAR.windowDepth	=	500;

		var viewingAngle =	60,
			aspect =		STAR.windowWidth / STAR.windowHeight,
			near =			0.1,
			far =			10000;

		var $container = $('#main-container');
		$container.css({
			'width': STAR.windowWidth+'px',
			'height': STAR.windowHeight+'px'
		});

		STAR.renderer =	new THREE.WebGLRenderer();
		STAR.camera =	new THREE.PerspectiveCamera(
			viewingAngle,
			aspect,
			near,
			far
		);
			
		STAR.scene = new THREE.Scene();
		
		STAR.scene.add(STAR.camera);
		STAR.camera.position.z = 500;

		// cameraControls = new THREE.LeapCameraControls(STAR.camera);

		// cameraControls.panHands = 2;
		// cameraControls.rotateEnabled = false;

		
		STAR.renderer.setSize(STAR.windowWidth, STAR.windowHeight);
		
		$container.append(STAR.renderer.domElement);
	},
	createSphere: function(){
		
		var radius = STAR.sphereRadius,
			segments = 20,
			rings = 20;
	
		var sphereMaterial = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			ambient: 0x00619e,
			color: 0x0084d6,
			wireframe: true
		});
			
		var mesh = new THREE.Mesh(
			new THREE.SphereGeometry(
				radius,
				segments,
				rings
			),
			sphereMaterial
		);
			
		STAR.scene.add(mesh);	
				
		mesh.position.set( STAR.spherePosX, STAR.spherePosY, STAR.spherePosZ );		
		mesh.rotation.set(STAR.sphereRotY, STAR.sphereRotZ, STAR.sphereRotX);		
		mesh.matrix.setRotationFromEuler(mesh.rotation);
		
		STAR.renderScene();		
		STAR.scene.remove(mesh);
	},
	blowUp: function(){
		
		STAR.renderScene();		
		STAR.scene.remove(mesh);
	},
	addLight: function(){
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.x = 200;
		pointLight.position.y = 500;
		pointLight.position.z = 1000;		
		STAR.scene.add(pointLight);
	},
	renderScene: function(){
		STAR.renderer.render(STAR.scene, STAR.camera);
		STAR.updateLog();
	},
	updateLog: function(){
		$('#posX').html( STAR.spherePosX.toFixed(2) );
		$('#posY').html( STAR.spherePosY.toFixed(2) );
		$('#posZ').html( STAR.spherePosZ.toFixed(2) );
		
		$('#rotX').html( STAR.sphereRotX.toFixed(2) );
		$('#rotY').html( STAR.sphereRotY.toFixed(2) );
		$('#rotZ').html( STAR.sphereRotZ.toFixed(2) );
		
		$('#radius').html( STAR.sphereRadius.toFixed(2) );

	},
	Functions: {
		setToRange: function(value, srcRange, dstRange, fallback){
			fallback = fallback || NaN;
			if (value < srcRange[0] || value > srcRange[1]){
				return fallback; 
			}
			var srcMax = srcRange[1] - srcRange[0],
			dstMax = dstRange[1] - dstRange[0],
			adjValue = value - srcRange[0];
			return (adjValue * dstMax / srcMax) + dstRange[0];
		}
	}
};

//---[ HERE WE GO... ]--------------------------------------------------------//
$(document).ready( STAR.init );
//----------------------------------------------------------------------------//