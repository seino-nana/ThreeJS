import * as THREE from "three";

export default class Base {
    constructor(canvas) {
        /* 场景 */
        this.scene = new THREE.Scene()

        /* 摄像机 */
        // 创建摄像机（透视摄像机）
        this.camera = new THREE.PerspectiveCamera(
            45, // 视角
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近面
            10000 // 远面
        )
        // 设置摄像机默认位置
        this.camera.position.set(2, 2, 5);
        // this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix()

        /* 渲染器 */
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        // 渲染器渲染场景
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(renderer.domElement);
        // 使物体更加清晰
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = true
    }
    /* 热更新 */
    update() {
        this.renderer.render(this.scene, this.camera)
    }
    // 自适应
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    /* 显示坐标系 */
    openAxes(axes = 2) {
        const axesHelper = new THREE.AxesHelper(axes);
        this.scene.add(axesHelper);
    }
    /* 跟随窗口变化 */
    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    /* 光源 */
}