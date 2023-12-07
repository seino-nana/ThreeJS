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
let cube; // 主体几何体
let cubeMat; // 主题几何体材质
const canvasDom = ref(null); // Vue ref 用于引用 canvas 元素

// 窗口变化触发base.js中的resize函数
window.addEventListener("resize", () => {
  base.resize()
});
onMounted(() => {
  // 在组件挂载后执行的钩子函数
  base = new Base(canvasDom.value); // 创建 Base 实例，传入 canvas 元素的引用
  // 物体可操作
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  // 新建主体几何体
  createCube();
  // 新建GUI
  createGui()
  // 启动更新循环
  update();
});
// 更新循环
function update() {
  requestAnimationFrame(update); // 使用浏览器的动画循环调用 update 函数，实现持续更新
  // 打开坐标系
  base.openAxes();
  // 调用base.js中的update热更新
  base.update();
  // 调用控制器热更新
  controls.update();
}
// 新建主体几何体
function createCube() {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  cubeMat = new THREE.MeshBasicMaterial({ color: "#955050" });
  cube = new THREE.Mesh(geo, cubeMat);
  // 几何体位置
  // cube.position.set(0, 0, 0);
  base.scene.add(cube);
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
  // 控制立方体的位移
  gui.add(cube.position, "x", -5, 5).name("控制X轴");
  gui.add(cube.position, "y", -5, 5).name("控制Y轴");
  gui.add(cube.position, "z", -5, 5).name("控制Z轴");
  // 控制旋转
  gui.add(cube.rotation, "x", -Math.PI, Math.PI).name("控制X轴旋转");
  gui.add(cube.rotation, "y", -Math.PI, Math.PI).name("控制Y轴旋转");
  gui.add(cube.rotation, "z", -Math.PI, Math.PI).name("控制Z轴旋转");
  gui.add(cubeMat, "wireframe").name("切换线框模式");

  let colorParams = {
    cubeColor: "#955050",
  };
  gui
    .addColor(colorParams, "cubeColor")
    .name("立方体颜色")
    .onChange((val) => {
      cube.material.color.set(val);
    });
}


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
