import * as THREE from '../build/three.module.js'

let changeStrength;
let flyTo = (TWEEN, option, controls, camera) => {
  option.position = option.position || []; // 相机新的位置
  option.controls = option.controls || []; // 控制器新的中心点位置(围绕此点旋转等)
  option.duration = option.duration || 1000; // 飞行时间
  option.easing = option.easing || TWEEN.Easing.Linear.None;
  TWEEN.removeAll();
  const curPosition = camera.position;
  const controlsTar = controls.target;
  const tween = new TWEEN.Tween({
    x1: curPosition.x, // 相机当前位置x
    y1: curPosition.y, // 相机当前位置y
    z1: curPosition.z, // 相机当前位置z
    x2: controlsTar.x, // 控制当前的中心点x
    y2: controlsTar.y, // 控制当前的中心点y
    z2: controlsTar.z // 控制当前的中心点z
  }).to({
    x1: option.position[0], // 新的相机位置x
    y1: option.position[1], // 新的相机位置y
    z1: option.position[2], // 新的相机位置z
    x2: option.controls[0], // 新的控制中心点位置x
    y2: option.controls[1], // 新的控制中心点位置x
    z2: option.controls[2]  // 新的控制中心点位置x
  }, option.duration).easing(TWEEN.Easing.Linear.None); // TWEEN.Easing.Cubic.InOut //匀速
  tween.onUpdate(() => {
    controls.enabled = false;
    camera.position.set(tween._object.x1, tween._object.y1, tween._object.z1);
    controls.target.set(tween._object.x2, tween._object.y2, tween._object.z2);
    controls.update();
    // 判断是否是可调用的函数?
    if (option.update instanceof Function) {
      option.update(tween)
    }
  });
  tween.onStart(() => {
    controls.enabled = false;
    if (option.start instanceof Function) {
      option.start()
    }
  });
  tween.onComplete(() => {
    controls.enabled = true;
    if (option.done instanceof Function) {
      option.done()
    }
  });
  tween.onStop(() => option.stop instanceof Function ? option.stop() : '');
  tween.start();
  TWEEN.add(tween);
  return tween
};

let fly = function (TWEEN, controls, camera) {
  /* const p =  new THREE.Box3().setFromObject(buildingGroup).getCenter(new THREE.Vector3())

   camera.position.set(p.x + 500,p.y+500,p.z + 500)
   controls.target.set(p.x,p.y,p.z)*/

  const p = new THREE.Vector3(0, 0, 0);

  controls.target.set(0, 0, 0);
  camera.position.set(100, 100, 100);
  const list = [
    // [-7377,-300,1500],
    [30, 30, 30],
    [100, 100, -100],
    [-100, 10, -100],
    [-100, 50, 100],
    [100, 100, 100]
  ];

  let n = 0;
  let v = camera.position.clone().sub(controls.target.clone());  // 计算两个向量的差值
  console.log(v)
  let x = list[n][0], y = list[n][1], z = list[n][2];
  // 添加项目动画
  flyTo(TWEEN, {
    position: [x, y, z],
    controls: [x - v.x, y - v.y, z - v.z],
    duration: 3000,
    // 连续调用flyTo 实现连续动画
    done: function () {
      n++;
      v = camera.position.clone().sub(controls.target.clone());
      x = list[n][0], y = list[n][1], z = list[n][2];
      controls.target.set(p.x, p.y, p.z);
      flyTo(TWEEN, {
        position: [x, y, z],
        duration: 2000,
        done: function () {
          n++;
          v = camera.position.clone().sub(controls.target.clone());
          x = list[n][0], y = list[n][1], z = list[n][2];
          flyTo(TWEEN, {
            position: [x, y, z],
            duration: 2000,
            done: function () {
              n++;
              v = camera.position.clone().sub(controls.target.clone());
              x = list[n][0], y = list[n][1], z = list[n][2];
              flyTo(TWEEN, {
                position: [x, y, z],
                duration: 2000,
                done: function () {
                  n++;
                  v = camera.position.clone().sub(controls.target.clone());
                  x = list[n][0], y = list[n][1], z = list[n][2];
                  flyTo(TWEEN, {
                    position: [x, y, z],  // 最终相机的位置
                    duration: 2000,
                    controls: [p.x, p.y, p.z], // controls 的控制点,旋转中心点
                    done: function () {
                      controls.autoRotate = true;
                      controls.autoRotateSpeed = -1;
                      setTimeout(() => {
                        controls.autoRotate = false
                      }, 1000 * 3);
                      changeStrength = true
                    }
                  }, controls, camera)
                }
              }, controls, camera)
            }
          }, controls, camera)
        }
      }, controls, camera)
    }
  }, controls, camera)
};

export {fly}