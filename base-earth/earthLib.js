import * as THREE from '../build/three.module.js'
let geographicToVector = (radius, lng, lat) => new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, (90 - lat) * (Math.PI / 180), (90 + lng) * (Math.PI / 180)))

let getSphereHeightPoints = (v0, v3, n1, n2, p0) => {
        // 夹角
        const angle = (v0.angleTo(v3) * 180) / Math.PI / 10 // 0 ~ Math.PI
        const aLen = angle * (n1 || 10)
        const hLen = angle * angle * (n2 || 120)
        p0 = p0 || new THREE.Vector3(0, 0, 0) // 默认以 坐标原点为参考对象
        // 法线向量
        const rayLine = new THREE.Ray(p0, v0.clone().add(v3.clone()).divideScalar(2))
        // 顶点坐标
        const vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0))
        // 计算制高点
        const getLenVector = (v1, v2, len) => v1.lerp(v2, len / v1.distanceTo(v2))
        // 控制点坐标
        return [getLenVector(v0.clone(), vtop, aLen), getLenVector(v3.clone(), vtop, aLen)]
    }


export {geographicToVector, getSphereHeightPoints}