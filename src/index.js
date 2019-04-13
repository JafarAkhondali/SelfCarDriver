// A to turn left D to turn right SPACE to accelerate.
//Click on the car before pressing any keys.
import * as BABYLON from 'babylonjs';
import * as Materials from 'babylonjs-materials';
import 'babylonjs-loaders';
import Config from './Config';
import {hexToRgb} from "./Utils/Helper";


const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);
const $fps = document.querySelector("#fps");
const options = require('./assets/sampleMap');


var scene = new BABYLON.Scene(engine);
var loader = new BABYLON.AssetsManager(scene);


function createScene (options){

    scene = new BABYLON.Scene(engine);

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(11.5, 3.5, 0));

    // lights
    var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, 2, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.75;

    /***************************Car*********************************************/

    /*-----------------------Car Body------------------------------------------*/

    //Car Body Material
    var bodyMaterial = new BABYLON.StandardMaterial("body_mat", scene);
    // const {r,g,b}=
    const carColor = hexToRgb(Config.COLOR.CAR);
    bodyMaterial.diffuseColor = new BABYLON.Color3(carColor.r, carColor.g, carColor.b);
    bodyMaterial.backFaceCulling = false;

    //Array of points for trapezium side of car.
    var side = [new BABYLON.Vector3(-6.5, 1.5, -2),
        new BABYLON.Vector3(2.5, 1.5, -2),
        new BABYLON.Vector3(3.5, 0.5, -2),
        new BABYLON.Vector3(-9.5, 0.5, -2)
    ];

    side.push(side[0]);	//close trapezium

    //Array of points for the extrusion path
    var extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 4)];

    //Create body and apply material
    var carBody = BABYLON.MeshBuilder.ExtrudeShape("body", {shape: side, path: extrudePath, cap : BABYLON.Mesh.CAP_ALL}, scene);
    carBody.material = bodyMaterial;
    camera.parent = carBody;
    /*-----------------------End Car Body------------------------------------------*/

    /*-----------------------Wheel------------------------------------------*/

    //Wheel Material
    var wheelMaterial = new BABYLON.StandardMaterial("wheel_mat", scene);
    var wheelTexture = new BABYLON.Texture("./assets/img/wheel.png", scene);
    wheelMaterial.diffuseTexture = wheelTexture;


    //Set color for wheel tread as black
    var faceColors=[];
    faceColors[1] = new BABYLON.Color3(0,0,0);

    //set texture for flat face of wheel
    var faceUV =[];
    faceUV[0] = new BABYLON.Vector4(0,0,1,1);
    faceUV[2] = new BABYLON.Vector4(0,0,1,1);

    //create wheel front inside and apply material
    var wheelFI = BABYLON.MeshBuilder.CreateCylinder("wheelFI", {diameter: 3, height: 1, tessellation: 24, faceColors:faceColors, faceUV:faceUV}, scene);
    wheelFI.material = wheelMaterial;

    //rotate wheel so tread in xz plane
    wheelFI.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
    /*-----------------------End Wheel------------------------------------------*/

    /*-------------------Pivots for Front Wheels-----------------------------------*/
    var pivotFI = new BABYLON.Mesh("pivotFI", scene);
    pivotFI.parent = carBody;
    pivotFI.position = new BABYLON.Vector3(-6.5, 0, -2);

    var pivotFO = new BABYLON.Mesh("pivotFO", scene);
    pivotFO.parent = carBody;
    pivotFO.position = new BABYLON.Vector3(-6.5, 0, 2);
    /*----------------End Pivots for Front Wheels--------------------------------*/

    /*------------Create other Wheels as Instances, Parent and Position----------*/
    var wheelFO = wheelFI.createInstance("FO");
    wheelFO.parent = pivotFO;
    wheelFO.position = new BABYLON.Vector3(0, 0, 1.8);

    var wheelRI = wheelFI.createInstance("RI");
    wheelRI.parent = carBody;
    wheelRI.position = new BABYLON.Vector3(0, 0, -2.8);

    var wheelRO = wheelFI.createInstance("RO");
    wheelRO.parent = carBody;
    wheelRO.position = new BABYLON.Vector3(0, 0, 2.8);

    wheelFI.parent = pivotFI;
    wheelFI.position = new BABYLON.Vector3(0, 0, -1.8);
    /*------------End Create other Wheels as Instances, Parent and Position----------*/



    function getCorneredPosition(x,y){
        const
            w2 = options.ground.width/2,
            h2 = options.ground.height/2;
        return new BABYLON.Vector3(x-w2,0,y-h2);
    }

    /*---------------------Create Car Centre of Rotation-----------------------------*/
    let pivot = new BABYLON.Mesh("pivot", scene); //current centre of rotation
    pivot.position.z = 50;
    carBody.parent = pivot;
    carBody.position = new BABYLON.Vector3(0, 0, -50);
    pivot["position"] = getCorneredPosition(options.car.position.x, options.car.position.y);
    // let newpos = getCorneredPosition(options.car.position.x, options.car.position.y);
    // setTimeout(function () {
    //
    // },1000);
    // newpos.z = -50;
    // carBody.position = newpos;

    /*---------------------End Create Car Centre of Rotation-------------------------*/


    /*************************** End Car*********************************************/

    /*****************************Add Ground********************************************/

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: options.ground.width, height: options.ground.height }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    let groundColor = hexToRgb(Config.COLOR.ground);
    groundMaterial.diffuseColor = new BABYLON.Color3(groundColor.r, groundColor.g, groundColor.b);
    ground.material = groundMaterial;
    ground.position.y = -1.5;
    /*****************************End Add Ground********************************************/

    /*****************************Particles to Show Movement********************************************/
    var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.position = new BABYLON.Vector3(20, 0, 10);



    /******************* Obstacles Renderer *******************/
    const treeColor = hexToRgb(Config.COLOR.TREE);
    const treeMaterial = new BABYLON.StandardMaterial("treeMaterial", scene);
    treeMaterial.diffuseColor = new BABYLON.Color3(treeColor.r, treeColor.g, treeColor.b);

    const pedestrianColor = hexToRgb(Config.COLOR.PEDESTRIAN);
    const pedestrianMaterial = new BABYLON.StandardMaterial("treeMaterial", scene);
    pedestrianMaterial.diffuseColor = new BABYLON.Color3(pedestrianColor.r, pedestrianColor.g, pedestrianColor.b);


    const addTree = (tree, name)=>{
        const treeObject = BABYLON.MeshBuilder.CreateBox("tree" + name, {height: Config.AREA.TREE.height, width: tree.width ||  Config.AREA.TREE.width, depth: tree.width || Config.AREA.TREE.width}, scene);
        treeObject.position = getCorneredPosition(tree.position.x, tree.position.y);
        treeObject.material = treeMaterial;
    }


    const addPerson = (person, name)=>{
        const personObject = BABYLON.MeshBuilder.CreateBox("tree" + name, {height: person.height || Config.AREA.PEDESTRIAN.height, width: Config.AREA.PEDESTRIAN.width, depth: Config.AREA.PEDESTRIAN.width}, scene);
        personObject.position = getCorneredPosition(person.position.x, person.position.y);
        personObject.material = pedestrianMaterial;
    }

    for(let i=0;i<options.trees.length;i++){
        addTree(options.trees[i], i);
    }

    for(let i=0;i<options.pedestrians.length;i++){
        addPerson(options.pedestrians[i], i);
    }

    var boxesSPS = new BABYLON.SolidParticleSystem("boxes", scene, {updatable: false});


    //function to position of grey boxes
    var set_boxes = function(particle, i, s) {
        particle.position = new BABYLON.Vector3(-options.ground.width/2 + Math.random()*options.ground.width, 0, -options.ground.height/2 + Math.random()*options.ground.height);
    };

    //add 400 boxes
    boxesSPS.addShape(box, 400, {positionFunction:set_boxes});
    var boxes = boxesSPS.buildMesh(); // mesh of boxes
    boxes.material = new BABYLON.StandardMaterial("", scene);
    boxes.material.alpha = 0.25;
    /*****************************Particles to Show Movement********************************************/



    /****************************Key Controls************************************************/

    var map ={}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    /****************************End Key Controls************************************************/


    /****************************Variables************************************************/

    var theta = 0;
    var deltaTheta = 0;
    var D = 0; //distance translated per second
    var R = 50; //turning radius, initial set at pivot z value
    var NR; //Next turning radius on wheel turn
    var A = 4; // axel length
    var L = 4; //distance between wheel pivots
    var r = 1.5; // wheel radius
    var psi, psiRI, psiRO, psiFI, psiFO; //wheel rotations
    var phi; //rotation of car when turning

    var F; // frames per second

    var distance;
    /****************************End Variables************************************************/



    /****************************Animation******************************************************/

    scene.registerAfterRender(function() {
        F = engine.getFps();
        $fps.innerHTML= (Math.round(F)+" FPS");

        if(map[" "] && D < 15 ) {
            D += 1;
        };

        if(D > 0.15) {
            D -= 0.15;
        }
        else {
            D = 0;
        }

        distance = D/F;
        psi = D/(r * F);

        if((map["a"] || map["A"]) && -Math.PI/6 < theta) {
            deltaTheta = -Math.PI/252;
            theta += deltaTheta;
            pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            if(Math.abs(theta) > 0.00000001) {
                NR = A/2 +L/Math.tan(theta);
            }
            else {
                theta = 0;
                NR = 0;
            }
            pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
            carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
            R = NR;

        };

        if((map["d"] || map["D"])  && theta < Math.PI/6) {
            deltaTheta = Math.PI/252;
            theta += deltaTheta;
            pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
            if(Math.abs(theta) > 0.00000001) {
                NR = A/2 +L/Math.tan(theta);
            }
            else {
                theta = 0;
                NR = 0;
            }
            pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
            carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
            R = NR;

        };

        if(D > 0) {
            phi = D/(R * F);
            if(Math.abs(theta)>0) {
                pivot.rotate(BABYLON.Axis.Y, phi, BABYLON.Space.WORLD);
                psiRI = D/(r * F);
                psiRO = D * (R + A)/(r * F);
                psiFI = D * Math.sqrt(R* R + L * L)/(r * F);
                psiFO = D * Math.sqrt((R + A) * (R + A) + L * L)/(r * F);

                wheelFI.rotate(BABYLON.Axis.Y, psiFI, BABYLON.Space.LOCAL);
                wheelFO.rotate(BABYLON.Axis.Y, psiFO, BABYLON.Space.LOCAL);
                wheelRI.rotate(BABYLON.Axis.Y, psiRI, BABYLON.Space.LOCAL);
                wheelRO.rotate(BABYLON.Axis.Y, psiRO, BABYLON.Space.LOCAL);
            }
            else {
                pivot.translate(BABYLON.Axis.X, -distance, BABYLON.Space.LOCAL);
                wheelFI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelFO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelRI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
                wheelRO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
            }
        }
    });

    /****************************End Animation************************************************/

    return scene;
}
function startScene(options){

    // call the createScene function
    var sscene = createScene(options);

    loader.onFinish = function(){
        engine.runRenderLoop(function(){
            sscene.render();
        });
    };

    loader.load();

}

const startBtn = document.querySelector('#startScene');
startBtn.addEventListener('click', function () {
    startScene(options);
    startBtn.style.display = 'none';
});
startBtn.click();

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
    engine.resize();
});
