// import {convertColor, randomColor, baseControls, basePlane} from "../lib/base";
// import {baseLightBar, lightBarParticlesTexture} from "../lib/lightBar";

import {baseLightBar} from '../lib/lightBar'

var camera, scene, renderer, boxMaterial, finalMesh, group, geometry;
var baseComposer, controls, finalComposer, params;
var materialDict, darkMaterial, bloomLayer;
var centerBoxHeight = 0;
var circleRadius = 6;
var H = 0;
var lightBarList = baseLightBar(3, 10, "#51ff3e")
var clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
init();
animate();

function init() {
    renderer = new THREE.WebGL1Renderer({
        canvas: document.getElementById("example"),
        antialias: true,
        autoClear: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight); //设置Canvas画布大小
    renderer.toneMapping = THREE.ReinhardToneMapping;
    // todo 必须打开该阴影，才能生效
    renderer.shadowMapEnabled = true;
    document.getElementById("glFullscreen").appendChild(renderer.domElement); //将画布渲染器绑定到新增的dom节点上；

    scene = new THREE.Scene();
    // scene.add(new THREE.GridHelper(10, 50))

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xaaaaaa, 1));

    controls = baseControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    // ========================================= 添加物体 ==================================================
    // 添加对象
    group = new THREE.Group();
    geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.name = 'centerBox';
    // fixme MeshBasicMaterial: 该材质自身不会有阴影渐变；
    boxMaterial = new THREE.MeshLambertMaterial({color: '#ff2850', emissive: 0x200000});

    finalMesh = new THREE.Mesh(geometry, boxMaterial);
    finalMesh.position.set(0, centerBoxHeight, 0);
    finalMesh.castShadow = true;
    finalMesh.receiveShadow = true;
    // finalMesh.layers.set(BLOOM_SCENE)
    // finalMesh.layers.toggle(BLOOM_SCENE);
    // center box 不需要添加到group中
    // scene.add(finalMesh);

    let sitePlane = basePlane("#fff", 30, 30);
    scene.add(sitePlane);

    let lightBarGroup = new THREE.Group()

    lightBarList.forEach(e => lightBarGroup.add(e));
    scene.add(lightBarGroup);
    lightBarGroup.position.set(0, 4, 0)

    // ========================================== 添加点击事件 ====================================
    window.addEventListener("resize", onWindowResize, false);
    // window.addEventListener("click", onDocumentMouseClick, false)

}

// ========================================== 添加运动事件 ========================================
function animate() {
    requestAnimationFrame(animate);
    H = H + 0.03;
    group.rotation.z += 0.001;
    group.rotation.y += 0.001;
    finalMesh.rotation.x += 0.01;
    finalMesh.rotation.y += 0.01;

    lightBarList.forEach(e => e.name === 'barParticle' ? e.rotateY(0.05) : '');
    lightBarList.forEach(e => e.scale.set(1, (Math.sin(H) + 1) * 1.2 + 1, 1));
    if (lightBarParticlesTexture) lightBarParticlesTexture.offset.y += 0.005;

    render()
}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    render()
}

function onDocumentMouseClick(event) {
    event.preventDefault();
    // 计算鼠标位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // console.log(group.children)
    let intersects = raycaster.intersectObjects(group.children);
    console.log(intersects);
    if (intersects.length > 0) {
        let object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE);
        render()
    }
}


function render() {
    //
    renderer.render(scene, camera)
}

