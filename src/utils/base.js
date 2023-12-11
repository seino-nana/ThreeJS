import * as THREE from "three";

export default class Base {
    constructor(canvas) {
        /* 实例化场景 */
        this.scene = new THREE.Scene()

        /* 摄像机 */
        // 实例化摄像机（透视摄像机）
        this.camera = new THREE.PerspectiveCamera(
            55, // 视角
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近面
            10000 // 远面
        )
        // 设置摄像机默认位置
        this.camera.position.set(-4.5, 1.5, 3);
        // this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix()

        /* 渲染器 */
        // 实例化渲染器
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        // 渲染器渲染场景
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(renderer.domElement);
        // 使物体更加清晰
        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 渲染器开启阴影计算
        this.renderer.shadowMap.enabled = true
    }
    /* 热更新 */
    update() {
        this.renderer.render(this.scene, this.camera)
        // 显示坐标系
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
    }
    // 自适应
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    /* 跟随窗口变化 */
    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    /* 光源 */
    // 添加环境光
    addAmbientLight(intensity = 1, color = 0xffffff) {
        let light = new THREE.AmbientLight(color, intensity)
        this.scene.add(light)
        return light //修改位置
    }
    // 添加方向光
    addDirLight(intensity = 1, color = 0xffffff) {
        let light = new THREE.DirectionalLight(color, intensity)
        light.castShadow = true; // 方向光投射阴影
        this.scene.add(light)
        return light //修改位置
    }
}