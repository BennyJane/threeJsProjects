import * as THREE from '../build/three.module.js'
// import * as MeshLineLib from '../static/jsm/THREE.MeshLine.js'
// import { MeshLineMaterial } from './THREE.MeshLine.js';

// todo 更新使用 MeshLine 模块的 MeshLineMaterial 材质
// todo 创建更多类型的发光曲线
let curverLineMove = function () {
  let getLineGeo;
  let height = 1.5;
  const list = [
    [-20, height + 10, -4],
    [10, height + 5, 5],
    [-6, height, 15],
    [10, height, 30],
  ];

  getLineGeo = list => {
    let linePoints;
    linePoints = [];
    for (let i = 0; i < list.length; i++) {
      linePoints.push(new THREE.Vector3(list[i][0], list[i][1], list[i][2]))
    }

    const curve = new THREE.CatmullRomCurve3(linePoints);
    const points = curve.getPoint(50);  // 将曲线分割为50端，也就是51个点

    const geometry = new THREE.Geometry();
    for (let i = 0; i < points.length; i++) {
      geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, points[i].z))
    }

    return {curve, geometry, points}

  };

  let res = getLineGeo(list);
//  绘制管道体
  let tubeGeometry = new THREE.TubeBufferGeometry(res.curve, 100, 0.05, 60);
  let texture = new THREE.TextureLoader().load("../static/textures/outLine/red_line.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1); // 调整出现的线条的多少
  // MeshLambertMaterial: 受光线影响,会出现明暗变化(类似 渐变消失 隐藏效果)
  //THREE.MeshBasicMaterial
  let tubeMesh = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({
    // color: 'rgb(235,0,76)',
    map: texture,
    opacity: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    // useMap: true,
    lineWidth: 4,
    // resolution: resolution,
    // dashArray: 0.8,
    // dashRatio: 0.5,
    // sizeAttenuation: 1,
    // near: camera.near,
    // ar: camera.far

  }));
  texture.needsUpdate = true;
  // tubeMesh.castShadow = true;
  // tubeMesh.receiveShadow = true;
  console.log(texture)
  return [texture, tubeMesh]
};

let ligthLine = function () {

}

let rectLine = function (w, h) {
  let geometryrect = rect(w, h);
  // LineSegments
  let lineSegments = new THREE.Line(geometryrect, new THREE.LineBasicMaterial({
    color: '#ffffff',
  }))
  lineSegments.computeLineDistances();
  lineSegments.position.set(10, -h*0.5, 10);
  return lineSegments
}

let boxOutLine = function (w, h, d) {
  var geometryBox = box(w, h, d);
  var lineSegments = new THREE.LineSegments(geometryBox, new THREE.LineDashedMaterial({
    color: '#ffffff',
    dashSize: 0.2,  //  设置虚线的间隔
    gapSize: 0.1,
    lineWidth: 2
  }));
  lineSegments.computeLineDistances();
  lineSegments.position.set(0, 0, 10);
  return lineSegments
}

function rect(width, height) {

  width = width * 0.5
  height = height * 0.5
  const y = 0

  var geometry = new THREE.BufferGeometry();
  var position = [];

  // 12 条线
  position.push(
    -width,y, -height,
    -width,y, height,

    -width,y, height,
    width,y, height,

    width,y, height,
    width,y, -height,

    width,y, -height,
    -width,y, -height,
  );

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  return geometry;

}

function box(width, height, depth) {

  width = width * 0.5,
    height = height * 0.5,
    depth = depth * 0.5;

  var geometry = new THREE.BufferGeometry();
  var position = [];

  // 12 条线
  position.push(
    -width, -height, -depth,
    -width, height, -depth,

    -width, height, -depth,
    width, height, -depth,

    width, height, -depth,
    width, -height, -depth,

    width, -height, -depth,
    -width, -height, -depth,

    -width, -height, depth,
    -width, height, depth,

    -width, height, depth,
    width, height, depth,

    width, height, depth,
    width, -height, depth,

    width, -height, depth,
    -width, -height, depth,

    -width, -height, -depth,
    -width, -height, depth,

    -width, height, -depth,
    -width, height, depth,

    width, height, -depth,
    width, height, depth,

    width, -height, -depth,
    width, -height, depth
  );

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  return geometry;

}

export {curverLineMove, ligthLine, boxOutLine, rectLine}