import * as THREE from '../build/three.module.js'
import {EffectComposer} from "../static/jsm/postprocessing/EffectComposer.js";
import {UnrealBloomPass} from "../static/jsm/postprocessing/UnrealBloomPass.js";


let initComposer = function (scene, camera, renderer) {
  // 后期处理渲染器
  let composer = new EffectComposer(renderer);
  return composer
}


let baseBoolm = function () {
  let params = {
    exposure: 0.9,
    bloomStrength: 10,
    bloomThreshold: 0.0,
    bloomRadius: 6
  };
  return new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),
    params.bloomStrength, params.bloomRadius, params.bloomThreshold)
}

export {baseBoolm, initComposer}