<script setup>
import { onMounted, ref } from "vue";
import Base from "@/utils/base.js";
import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let controls; // 用户存储是否可操作摄像机
let base; // 用于存储 Base 类的实例
const canvasDom = ref(null); // Vue ref 用于引用 canvas 元素

// 窗口变化触发base.js中的resize函数
window.addEventListener("resize", () => {
  base.resize();
});
onMounted(() => {
  // 在组件挂载后执行的钩子函数
  base = new Base(canvasDom.value); // 创建 Base 实例，传入 canvas 元素的引用
  // 物体可操作
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  createShpere();

  // 新建GUI
  createGui();
  // 启动更新循环
  update();
});
// 更新循环
function update() {
  requestAnimationFrame(update); // 使用浏览器的动画循环调用 update 函数，实现持续更新

  // 调用base.js中的update热更新
  base.update();
  // 调用控制器热更新
  controls.update();
}
// 新建GUI
function createGui() {
  let eventObj = {
    Fullscreen: function () {
      // 全屏
      document.body.requestFullscreen();
    },
    ExitFullscreen: function () {
      document.exitFullscreen();
    },
  };
  // 创建GUI
  const gui = new GUI();
  // 添加按钮
  gui.add(eventObj, "Fullscreen").name("全屏");
  gui.add(eventObj, "ExitFullscreen").name("退出全屏");
}
let sphere1;
let sphere2;
let sphere3;
// 创建几何体
function createShpere() {
  sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    createMaterial()
  );
  sphere1.position.x = -2;
  base.scene.add(sphere1);
  sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    createMaterial()
  );
  sphere2.position.x = 0;
  base.scene.add(sphere2);
  sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    createMaterial()
  );
  sphere3.position.x = 2;
  base.scene.add(sphere3);
}
// 创建随机颜色的材质
function createMaterial() {
  return new THREE.MeshBasicMaterial({
    color: Math.floor(Math.random() * (1 << 24)),
  });
}
const rayaster = new THREE.Raycaster(); // 射线
const mouse = new THREE.Vector2(); // 创建鼠标向量

// 监听鼠标点击坐标
window.addEventListener("click", (event) => {
  // console.log(event.clientX, event.clientY);
  // 设置鼠标向量的x,y值
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 通过摄像机和鼠标位置更新射线
  rayaster.setFromCamera(mouse, base.camera);
  // 获取与射线相交的物体
  const intersects = rayaster.intersectObjects([sphere1, sphere2, sphere3]);
  // 如果相交
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xffffff);
  }
});
</script> 

<template>
  <div>
    <!-- Vue 模板，包含一个用于渲染 3D 场景的 canvas 元素 -->
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<style scoped>
#canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
