/**
 * http://danielmcgraw.com/2010/10/06/How-To-Skin-Your-Minecraft-Character/
 * http://www.minecraftskins.com/
 * http://www.minecraftskins.info/
 * http://www.minecraftwiki.net/wiki/Anvil_file_format
*/
tQuery.register('MinecraftChar', function(){
	/**
	 * Could be replace by a CubeGeometry but would require to change the whole indexing
	 * not now.
	*/
	function cubeFromPlanes (size, mat) {
		var cube = new THREE.Object3D();
		var meshes = [];
		for(var i=0; i < 6; i++) {
			var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
			// mesh.doubleSided = true;
			cube.add(mesh);
			meshes.push(mesh);
		}
		// Front
		meshes[0].rotation.x = Math.PI/2;
		meshes[0].rotation.z = -Math.PI/2;
		meshes[0].position.x = size/2;
		
		// Back
		meshes[1].rotation.x = Math.PI/2;
		meshes[1].rotation.z = Math.PI/2;
		meshes[1].position.x = -size/2;
		
		// Top
		meshes[2].position.y = size/2;
		
		// Bottom
		meshes[3].rotation.y = Math.PI;
		meshes[3].rotation.z = Math.PI;
		meshes[3].position.y = -size/2;
		
		// Left
		meshes[4].rotation.x = Math.PI/2;
		meshes[4].position.z = size/2;
		
		// Right
		meshes[5].rotation.x = -Math.PI/2;
		meshes[5].rotation.y = Math.PI;
		meshes[5].position.z = -size/2;
		
		return cube;
	};
	function getMaterial(image, transparent) {
		var tex		= new THREE.Texture(image);
		tex.magFilter	= THREE.NearestFilter;
		tex.minFilter	= THREE.NearestFilter;
		tex.format	= transparent ? THREE.RGBAFormat : THREE.RGBFormat;
		tex.needsUpdate	= true;
		var material	= new THREE.MeshBasicMaterial({
			map		: tex,
			transparent	: transparent ? true : false
		});
		return material;
	}
	function uvmap (geometry, face, x, y, w, h, rotateBy) {
		if(!rotateBy) rotateBy = 0;
		var uvs = geometry.faceVertexUvs[0][face];
		var tileU = x;
		var tileV = y;
		
		uvs[ (0 + rotateBy) % 4 ].u = tileU * tileUvW;
		uvs[ (0 + rotateBy) % 4 ].v = tileV * tileUvH;
		uvs[ (1 + rotateBy) % 4 ].u = tileU * tileUvW;
		uvs[ (1 + rotateBy) % 4 ].v = tileV * tileUvH	+ h * tileUvH;
		uvs[ (2 + rotateBy) % 4 ].u = tileU * tileUvW	+ w * tileUvW;
		uvs[ (2 + rotateBy) % 4 ].v = tileV * tileUvH	+ h * tileUvH;
		uvs[ (3 + rotateBy) % 4 ].u = tileU * tileUvW	+ w * tileUvW;
		uvs[ (3 + rotateBy) % 4 ].v = tileV * tileUvH;
	};

	var canvas	= document.createElement('canvas');
	canvas.width	= 64;
	canvas.height	= 32;
	var context	= canvas.getContext('2d');
	var material	= getMaterial(canvas, false);
	var materialTrans	= getMaterial(canvas, true);

	// Player model

	var playerModel	= tQuery.createObject3D();
	playerModel.scaleBy(1/35).rotateY(-Math.PI/2)
	
	
	var tileUvW	= 1/canvas.width;
	var tileUvH	= 1/canvas.height;
	
	var headgroup	= new THREE.Object3D();
	var upperBody	= new THREE.Object3D();

	// Left leg
	var leftleggeo = new THREE.CubeGeometry(4, 12, 4);
	for(var i=0; i < 8; i+=1) {
		leftleggeo.vertices[i].y -= 6;
	}
	var leftleg = new THREE.Mesh(leftleggeo, material);
	leftleg.position.z = -2;
	leftleg.position.y = -6;
	uvmap(leftleggeo, 0,  8, 20, -4, 12);
	uvmap(leftleggeo, 1, 16, 20, -4, 12);
	uvmap(leftleggeo, 2,  4, 16,  4,  4, 3);
	uvmap(leftleggeo, 3,  8, 20,  4, -4, 1);
	uvmap(leftleggeo, 4, 12, 20, -4, 12);
	uvmap(leftleggeo, 5,  4, 20, -4, 12);
	playerModel.add(leftleg)

	
	// Right leg
	var rightleggeo = new THREE.CubeGeometry(4, 12, 4);
	for(var i=0; i < 8; i+=1) {
		rightleggeo.vertices[i].y -= 6;
	}
	var rightleg = new THREE.Mesh(rightleggeo, material);
	rightleg.position.z = 2;
	rightleg.position.y = -6;
	uvmap(rightleggeo, 0,  4, 20,  4, 12);
	uvmap(rightleggeo, 1, 12, 20,  4, 12);
	uvmap(rightleggeo, 2,  8, 16, -4,  4, 3);
	uvmap(rightleggeo, 3, 12, 20, -4, -4, 1);
	uvmap(rightleggeo, 4,  0, 20,  4, 12);
	uvmap(rightleggeo, 5,  8, 20,  4, 12);
	playerModel.add(rightleg)


	var upperBody	= tQuery.createObject3D();
	playerModel.add(upperBody)


	// Body
	var bodygeo	= new THREE.CubeGeometry(4, 12, 8);
	var bodymesh	= new THREE.Mesh(bodygeo, material);
	uvmap(bodygeo, 0, 20, 20, 8, 12);
	uvmap(bodygeo, 1, 32, 20, 8, 12);
	uvmap(bodygeo, 2, 20, 16, 8, 4, 1);
	uvmap(bodygeo, 3, 28, 16, 8, 4, 3);
	uvmap(bodygeo, 4, 16, 20, 4, 12);
	uvmap(bodygeo, 5, 28, 20, 4, 12);
	upperBody.add(bodymesh);
	
	
	// Left arm
	var leftarmgeo = new THREE.CubeGeometry(4, 12, 4);
	for(var i=0; i < 8; i+=1) {
		leftarmgeo.vertices[i].y -= 4;
	}
	var leftarm = new THREE.Mesh(leftarmgeo, material);
	leftarm.position.z = -6;
	leftarm.position.y = 4;
	leftarm.rotation.x = Math.PI/32;
	uvmap(leftarmgeo, 0, 48, 20, -4, 12);
	uvmap(leftarmgeo, 1, 56, 20, -4, 12);
	uvmap(leftarmgeo, 2, 48, 16, -4, 4, 1);
	uvmap(leftarmgeo, 3, 52, 16, -4, 4, 3);
	uvmap(leftarmgeo, 4, 52, 20, -4, 12);
	uvmap(leftarmgeo, 5, 44, 20, -4, 12);
	upperBody.add(leftarm);
	
	// Right arm
	var rightarmgeo = new THREE.CubeGeometry(4, 12, 4);
	for(var i=0; i < 8; i+=1) {
		rightarmgeo.vertices[i].y -= 4;
	}
	var rightarm = new THREE.Mesh(rightarmgeo, material);
	rightarm.position.z = 6;
	rightarm.position.y = 4;
	rightarm.rotation.x = -Math.PI/32;
	uvmap(rightarmgeo, 0, 44, 20, 4, 12);
	uvmap(rightarmgeo, 1, 52, 20, 4, 12);
	uvmap(rightarmgeo, 2, 44, 16, 4, 4, 1);
	uvmap(rightarmgeo, 3, 48, 16, 4, 4, 3);
	uvmap(rightarmgeo, 4, 40, 20, 4, 12);
	uvmap(rightarmgeo, 5, 48, 20, 4, 12);
	upperBody.add(rightarm);

	var headgroup	= new THREE.Object3D();
	upperBody.add(headgroup)
	headgroup.position.y = 8;

	//Head
	var headgeo	= new THREE.CubeGeometry(8, 8, 8);
	var headmesh	= new THREE.Mesh(headgeo, material);
	headmesh.position.y = 2;
	uvmap(headgeo, 0, 8, 8, 8, 8);
	uvmap(headgeo, 1, 24, 8, 8, 8);	
	uvmap(headgeo, 2, 8, 0, 8, 8, 1);
	uvmap(headgeo, 3, 16, 0, 8, 8, 3);
	uvmap(headgeo, 4, 0, 8, 8, 8);
	uvmap(headgeo, 5, 16, 8, 8, 8);
	headgroup.add(headmesh);

	
	var helmet	= cubeFromPlanes(9, materialTrans);
	helmet.position.y = 2;
	uvmap(helmet.children[0].geometry, 0, 32+8, 8, 8, 8);
	uvmap(helmet.children[1].geometry, 0, 32+24, 8, 8, 8);
	uvmap(helmet.children[2].geometry, 0, 32+8, 0, 8, 8, 1);
	uvmap(helmet.children[3].geometry, 0, 32+16, 0, 8, 8, 3);
	uvmap(helmet.children[4].geometry, 0, 32+0, 8, 8, 8);
	uvmap(helmet.children[5].geometry, 0, 32+16, 8, 8, 8);
	headgroup.add(helmet);
	
	var ears	= new THREE.Object3D();
	var eargeo	= new THREE.CubeGeometry(1, (9/8)*6, (9/8)*6);
	var leftear	= new THREE.Mesh(eargeo, material);
	var rightear	= new THREE.Mesh(eargeo, material);
	leftear.position.y	= 2+(9/8)*5;
	rightear.position.y	= 2+(9/8)*5;
	leftear.position.z	= -(9/8)*5;
	rightear.position.z	=  (9/8)*5;
	uvmap(eargeo, 0, 25, 1, 6, 6);		// Front side
	uvmap(eargeo, 1, 32, 1, 6, 6);		// Back side
	uvmap(eargeo, 2, 25, 0, 6, 1, 1);	// Top edge
	uvmap(eargeo, 3, 31, 0, 6, 1, 1);	// Bottom edge	
	uvmap(eargeo, 4, 24, 1, 1, 6);		// Left edge
	uvmap(eargeo, 5, 31, 1, 1, 6);		// Right edge
	ears.add(leftear);
	ears.add(rightear);
	leftear.visible = rightear.visible = false;
	headgroup.add(ears);


	//////////////////////////////////////////////////////////////////////////
	//		load the skin							//
	//////////////////////////////////////////////////////////////////////////
	var skinImage	= new Image();
	skinImage.onload = function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(skinImage, 0, 0);
		material.map.needsUpdate = true;
		materialTrans.map.needsUpdate = true;
	};
	skinImage.src = "images/char.png";
	skinImage.src = "images/batman.png";
	skinImage.src = "images/Mario.png";
	skinImage.src = "images/3djesus.png";

	return {
		model	: playerModel,
		parts	: {
			headGroup	: headgroup,
			legL		: leftleg,
			legR		: rightleg,
			armR		: rightarm,
			armL		: leftarm
		}
	};
});