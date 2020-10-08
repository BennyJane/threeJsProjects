// 声明 raycaster 和 mouse 变量
// let raycaster = new THREE.Raycaster();
// let mouse = new THREE.Vector2();
// let selectObject;
//
// function onMouseOver(evnet, camera, scene) {
//     event.preventDefault();
//     // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
//     // 鼠标文档坐标 转化为 空间坐标
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//
//     getIntersects(camera, scene)
// }
//
// // 获取与射线相交的对象数组
// function getIntersects(camera, scene) {
//     //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
//     raycaster.setFromCamera(mouse, camera);
//     // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
//     let intersects = raycaster.intersectObjects(scene.children);
//     if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
//         console.log(intersects)
//         selectObject = intersects[0].object;
//         // changeMaterial(selectObject)
//     } else {
//         selectObject = undefined;
//     }
// }
//
// // 调整弹窗的位置
// function renderDiv(object) {
//     let labelDom = document.getElementById("label");
//     if (object !== undefined) {
//         let halfWidth = window.innerWidth / 2;
//         let halfHeight = window.innerHeight / 2;
//         let vector = object.position.clone().project(camera);
//         labelDom.innerHTML = 'name: ' + object.name;
//         let leftDist = vector.x * halfWidth + halfWidth;
//         let topDist = vector.y * halfHeight + halfHeight - 10;
//         labelDom.setAttribute('style', 'left: ' + leftDist + 'px; top : ' + topDist + 'px;')
//     } else {
//         labelDom.setAttribute('style', 'visible: hidden')
//     }
// }