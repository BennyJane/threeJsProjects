import * as THREE from '../build/three.module.js'
import {OrbitControls} from "../static/jsm/controls/OrbitControls.js";

let convertColor = function (color) {
  return new THREE.Color(color)
};

let randomColor = function () {
  let color = new THREE.Color()
  color.setHSL(0.5, 0.9, Math.random() * 0.5 + 0.05)
  return color
};

let baseControls = function (camera, dom) {
  // 相机, dom节点, 渲染函数
  let control = new OrbitControls(camera, dom)
  control.maxPolarAngle = Math.PI * 0.5;
  control.minDistance = 1;
  control.maxDistance = 100;
  // 需要设置该参数,添加拖动效果
  return control
}

let basePlane = function (color, w, d) {
  let floorGeometry = new THREE.PlaneBufferGeometry(w, d);
  let floorMesh = new THREE.Mesh(floorGeometry, new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: convertColor(color)
  }));
  floorMesh.name = 'floorPlane';
  floorMesh.rotation.x += Math.PI * 0.5;
  floorMesh.position.y -= 4;
  floorMesh.receiveShadow = true;
  floorGeometry.castShadow = true;
  return floorMesh
}

export {convertColor, randomColor, baseControls, basePlane}