import * as THREE from '../build/three.module.js'

let getIntersects = function (event, camera, scene, targetGroup = undefined) {
  event.preventDefault();

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects;
  if (targetGroup === undefined) {
    intersects = raycaster.intersectObjects(scene.children)
  } else {
    intersects = raycaster.intersectObjects(targetGroup)
  }
  return intersects
}

export {getIntersects}