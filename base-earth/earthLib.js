import * as THREE from '../build/three.module.js'

let geographicToVector = (radius, lng, lat) => new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, (90 - lat) * (Math.PI / 180), (90 + lng) * (Math.PI / 180)));

let getSphereHeightPoints = (v0, v3, n1, n2, p0) => {
  // 夹角
  const angle = (v0.angleTo(v3) * 180) / Math.PI / 10; // 0 ~ Math.PI
  const aLen = angle * (n1 || 10);
  const hLen = angle * angle * (n2 || 120);
  p0 = p0 || new THREE.Vector3(0, 0, 0); // 默认以 坐标原点为参考对象
  // 法线向量
  const rayLine = new THREE.Ray(p0, v0.clone().add(v3.clone()).divideScalar(2));
  // 顶点坐标
  const vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
  // 计算制高点
  const getLenVector = (v1, v2, len) => v1.lerp(v2, len / v1.distanceTo(v2));
  // 控制点坐标
  return [getLenVector(v0.clone(), vtop, aLen), getLenVector(v3.clone(), vtop, aLen)]
};


let addCircle = function (position) {
  let CircleRadius = 4;
  const hexagonLine = new THREE.CircleGeometry(CircleRadius, 15);
  const vertices = hexagonLine.vertices;
  vertices.shift(); // 第一个节点是中心点
  const circleLineGeom = new THREE.Geometry();
  circleLineGeom.vertices = vertices;
  const circleLine = new THREE.LineLoop(circleLineGeom, new THREE.MeshBasicMaterial({
    color: "#009A65",
    side: THREE.DoubleSide,
    depthTest: true
  }));
  circleLine.position.copy(position);
  // 设置朝向圆点
  circleLine.lookAt(new THREE.Vector3(0, 0, 0));
  return circleLine
};

let setCircle = function (divisions = 100, raduis = 100) {
  let vertices = [];
  for (let i = 0; i <= divisions; i++) {
    let v = (i / divisions) * (Math.PI * 2);
    let x = raduis * Math.sin(v);
    let z = raduis * Math.cos(v);
    vertices.push(x, 0, z);
  }
  return vertices
};


// 绘制轨道卫星线条
let moonLine = function (R, edg) {
  let pointNum = 60;
  let points = setCircle(pointNum, R);
  let geometryArc = new THREE.BufferGeometry();
  geometryArc.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );
  // 为外部的圆弧添加样式
  let mt = new THREE.LineBasicMaterial({
    color: "#00ffa7",
    renderOrder: 10,
    transparent: true,
    linewidth: 2,
    opacity: 0.7
  });
  let line = new THREE.Line(geometryArc, mt);
  // line.rotateY(Math.random() * Math.PI)
  line.rotateX(Math.random() * edg);
  line.rotateZ(Math.random() * edg);
  // moonItem(points, pointNum);
  return line
};

// let moonItem = function (arcPoints, num = 100) {
//   console.log(arcPoints, "sate point");
//   this.drawSatellite(arcPoints.slice(0, 3));
//   let arr = Array.from(Array(num + 1), (v, k) => k);
//   let times = new Float32Array(arr);
//
//   let posArr = [];
//   for (let i = 0; i < arcPoints.length; i = i + 3) {
//     posArr.push(arcPoints[i], arcPoints[i + 1], arcPoints[i + 2]);
//   }
//
//   let values = new Float32Array(posArr);
//   console.log("len", times.length, values.length);
//   let posTrack = new THREE.KeyframeTrack(
//     "satellite.position",
//     times,
//     values
//   );
//
//   let duration = 101;
//   let moonClip = new THREE.AnimationClip("satellite", duration, [posTrack]);
//   this.satelliteMixer = new THREE.AnimationMixer(this.moon);
//   let satelliteAction = this.satelliteMixer.clipAction(moonClip);
//   satelliteAction.timeScale = 5;
//   satelliteAction.play();
// }


let addTexturePoints = function (R) {
  let earthParticles = new THREE.Object3D();
  // 必须先创建一个节点, 作为canvas的画板, 绘制点
  const earthImg = document.createElement('img');
  earthImg.src = 'images/blackWhiteMap.png';
  // 图片加载后,再绘制图片
  earthImg.onload = () => {
    let earthCanvas = document.createElement('canvas'),
      earthCtx = earthCanvas.getContext('2d');
    // 设置画板的大小
    earthCanvas.width = earthImg.width;
    earthCanvas.height = earthImg.height;
    // 在canvas上绘制图片: 图片实例, 坐标位置(2个参数), 图片尺寸(两个参数)
    earthCtx.drawImage(earthImg, 0, 0, earthImg.width, earthImg.height);
    // 获取图片的像素数据, 每个像素点 对应四个数值: r g b a
    const earthImgData = earthCtx.getImageData(0, 0, earthImg.width, earthImg.height);
    const BLINT_SPEED = 0.05;
    let positions = [];
    let materials = [];
    let sizes = [];
    for (let i = 0; i < 2; i++) {
      positions[i] = {
        positions: []
      };
      sizes[i] = {
        sizes: []
      };
      const mat = new THREE.PointsMaterial({
        size: 8,  // 设置圈的尺寸
        color: new THREE.Color('#5BE5A0'),  // 区域点颜色 0x03d98e
        map: new THREE.TextureLoader().load("images/dot.png"),
        depthWrite: false,
        depthTest: false,
        transparent: true,
        opacity: 0.15,  // 透明度为0 , 默认不显示
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
      });
      let n = i / 2;
      mat.t_ = n * Math.PI * 2;  // 取值: 0 => 0 ；1=> 2 * pi
      mat.speed_ = BLINT_SPEED;
      mat.min_ = .2 * Math.random() + .5;
      mat.delta_ = .1 * Math.random() + .1;
      mat.opacity_coef_ = 1;
      materials.push(mat)
    }
    // 绘制等大小的球体
    let spherical = new THREE.Spherical();
    spherical.radius = R;
    const step = 180; // 每圈点的密度: 250
    // todo 控制维度方向的圆点的密度, 维度越高, 点的密度越小
    for (let i = 0; i < step; i++) {
      let vec = new THREE.Vector3();
      // let radians = step * (1 - Math.sin(i / step * Math.PI)) / step + .5; // 每个纬线圈内的角度均分
      let radians = (1 - Math.sin(i / step * Math.PI)) + .5; // 每个纬线圈内的角度均分
      for (let j = 0; j < step; j += radians) {
        let c = j / step, // 底图上的横向百分比  ==> 纬度方向的分割: 0~1
          f = i / step, // 底图上的纵向百分比  ==> 经度方向的分割: 0~1
          index = Math.floor(2 * Math.random());  // 随机结果 0 OR 1
        const pos = positions[index];
        const size = sizes[index];
        if (isLandByUV(c, f)) { // 根据横纵百分比判断在底图中的像素值的透明度是否为0
          // 范围: -Math.PI/2 ~ Math.PI * 1.5
          // 必须是这个范围, 否则 点会与下面的图对不上
          spherical.theta = c * Math.PI * 2 - Math.PI / 2; // 横纵百分比转换为theta和phi夹角
          // spherical.theta = c * Math.PI * 2; // 横纵百分比转换为theta和phi夹角
          spherical.phi = f * Math.PI; // 横纵百分比转换为theta和phi夹角
          vec.setFromSpherical(spherical); // 夹角转换为世界坐标
          pos.positions.push(vec.x);
          pos.positions.push(vec.y);
          pos.positions.push(vec.z);
          if (j % 3 === 0) {
            size.sizes.push(6.0)
          }
        }
      }
    }
    for (let i = 0; i < positions.length; i++) {
      let pos = positions[i],
        size = sizes[i],
        bufferGeom = new THREE.BufferGeometry,
        typedArr1 = new Float32Array(pos.positions.length),
        typedArr2 = new Float32Array(size.sizes.length);
      // 将一般的数组转化为 Float32Array
      for (let j = 0; j < pos.positions.length; j++) {
        typedArr1[j] = pos.positions[j]
      }
      for (let j = 0; j < size.sizes.length; j++) {
        typedArr2[j] = size.sizes[j]
      }
      bufferGeom.addAttribute("position", new THREE.BufferAttribute(typedArr1, 3));
      bufferGeom.addAttribute('size', new THREE.BufferAttribute(typedArr2, 1));
      bufferGeom.computeBoundingSphere();
      let particle = new THREE.Points(bufferGeom, materials[i]);
      earthParticles.add(particle)
    }

    function isLandByUV(c, f) {
      if (!earthImgData) { // 底图数据
        console.error('data error!')
      }
      // 根据百分比, 计算图片中对应的坐标
      const n = parseInt(earthImg.width * c); // 横坐标   根据横纵百分比计算图象坐标系中的坐标
      const o = parseInt(earthImg.height * f); //纵坐标   根据横纵百分比计算图象坐标系中的坐标
      // 计算坐标对应像素点的 A-alpha值, 判断透明度是否为0
      // 计算思路: 像素点为整数,(10, 20) 位置的点之前有 10 * 每行像素点数量 + 20
      // 每个像素点 的颜色由 4个数值记录, 所以再乘以4
      return 0 === earthImgData.data[4 * (o * earthImgData.width + n)] // 查找底图中对应像素点的rgba值并判断
    }
  };
  return earthParticles
};

let computeDis = function (lineGeo) {
  let positions = lineGeo.geometry.attributes.position.array;
  let minDist = 8000;
  let centerPoint = 300;
  for (let i = 0; i < 61; i++) {
    let x = positions[i * 3];
    let y = positions[i * 3 + 1];
    let z = positions[i * 3 + 2];
    let dist = Math.sqrt((x - centerPoint) * (x - centerPoint) + (y - centerPoint) * (y - centerPoint) + (z - centerPoint) * (z - centerPoint));
    // console.log(dist)
    if (dist < minDist) {
      minDist = dist
    }
  }

  let opa = 1.0;
  if (minDist < 386) {
    opa = (minDist - 250) / 386
  }
  console.log(minDist, opa);
  return opa
};


let skyTexture = function (scene) {
  const texture = new THREE.TextureLoader().load('images/backgroupImg.png')
  scene.background = texture;
}


export {
  geographicToVector, getSphereHeightPoints,
  addCircle, moonLine, addTexturePoints, computeDis, skyTexture
}