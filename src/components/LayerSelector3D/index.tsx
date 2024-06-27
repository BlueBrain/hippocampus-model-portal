import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Layer } from '../../types';
import { layers } from '../../constants';
import styles from './styles.module.scss';

type LayerSelectProps3D = {
    value?: Layer;
    onSelect?: (layer: Layer) => void;
    theme?: number;
};

const LayerSelector3D: React.FC<LayerSelectProps3D> = ({ value, onSelect, theme: themeProp }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [trapezoids, setTrapezoids] = useState<THREE.Mesh[]>([]);
    const [edges, setEdges] = useState<THREE.LineSegments[]>([]);
    const [texts, setTexts] = useState<THREE.Mesh[]>([]);
    const [sceneReady, setSceneReady] = useState(false);
    const [scene, setScene] = useState<THREE.Scene | null>(null);
    const [camera, setCamera] = useState<THREE.OrthographicCamera | null>(null);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

    const distance = 0;
    const angle = 10;
    const initialTopWidth = 1.5;
    const edgeThickness = 1;

    const theme = {
        1: { default: 0x44405B, hover: 0x745F6C, selected: 0xA37E7C, selectedEdges: 0xEFAE97 }, //ok
        2: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
        3: { default: 0x413C5B, hover: 0x715970, selected: 0x8E677D, selectedEdges: 0xCC8A99 }, //ok
        4: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
        5: { default: 0x44405B, hover: 0x745F6C, selected: 0x886C73, selectedEdges: 0xEFAE97 },
    };

    const trapezoidHeights = {
        SLM: 0.224 * 1.6,
        SR: 0.42791 * 1.6,
        SP: 0.090 * 1.6,
        SO: 0.258 * 1.6,
    };

    useEffect(() => {
        if (!mountRef.current) return;

        const newScene = new THREE.Scene();
        newScene.background = new THREE.Color(0x313354);

        const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        const frustumSize = 5;

        const newCamera = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        newCamera.position.set(0, -10, 90);
        newCamera.lookAt(0, 0, 1);
        newCamera.zoom = 2.2;
        newCamera.updateProjectionMatrix();

        const newRenderer = new THREE.WebGLRenderer({ antialias: true });
        newRenderer.setPixelRatio(window.devicePixelRatio);
        newRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(newRenderer.domElement);

        setScene(newScene);
        setCamera(newCamera);
        setRenderer(newRenderer);
        setSceneReady(true);

        const handleResize = () => {
            if (mountRef.current && newRenderer && newCamera) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;

                newRenderer.setSize(width, height);

                const aspect = width / height;
                newCamera.left = (-frustumSize * aspect) / 2;
                newCamera.right = (frustumSize * aspect) / 2;
                newCamera.top = frustumSize / 2;
                newCamera.bottom = -frustumSize / 2;
                newCamera.updateProjectionMatrix();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(newRenderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        if (!sceneReady || !scene || !camera || !renderer) return;

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const trapezoidArray: THREE.Mesh[] = [];
        const edgeArray: THREE.LineSegments[] = [];
        const textArray: THREE.Mesh[] = [];
        const numTrapezoids = layers.length;
        let yOffset = 0;
        let topWidth = initialTopWidth;

        const totalHeight = layers.reduce((acc, layer) => acc + (trapezoidHeights[layer] || 1) + distance, -distance);
        yOffset = totalHeight / 2;

        const loader = new FontLoader();
        loader.load('/hippocampus-portal-dev/assets/fonts/Titillium_Web_Light_.json', (font) => {
            for (let i = 0; i < numTrapezoids; i++) {
                const height = trapezoidHeights[layers[i]] || 1;
                const angleRad = THREE.MathUtils.degToRad(angle);
                const bottomWidth = topWidth - 2 * height * Math.tan(angleRad);

                const topCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-topWidth / 2, height / 2, 0),
                    new THREE.Vector3(0, height / 2 + 0.02, 0),
                    new THREE.Vector3(topWidth / 2, height / 2, 0),
                ]);

                const bottomCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-bottomWidth / 2, -height / 2, 0),
                    new THREE.Vector3(0, -height / 2 + 0.02, 0),
                    new THREE.Vector3(bottomWidth / 2, -height / 2, 0),
                ]);

                const topPoints = topCurve.getPoints(20);
                const bottomPoints = bottomCurve.getPoints(20);

                const shape = new THREE.Shape();
                shape.moveTo(topPoints[0].x, topPoints[0].y);
                topPoints.forEach((point) => shape.lineTo(point.x, point.y));
                bottomPoints.reverse().forEach((point) => shape.lineTo(point.x, point.y));
                shape.lineTo(topPoints[0].x, topPoints[0].y);

                const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
                const trapezoid = new THREE.Mesh(geometry, material.clone());
                trapezoid.userData.layer = layers[i];
                trapezoid.userData.index = i;

                trapezoid.position.set(0, yOffset - height / 2, 0.05);
                scene.add(trapezoid);
                trapezoidArray.push(trapezoid);

                const edgeGeometry = new THREE.EdgesGeometry(geometry);
                const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: edgeThickness, linecap: 'round', linejoin: 'round' });
                const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
                edges.position.set(0, yOffset - height / 2, 0.05);
                scene.add(edges);
                edgeArray.push(edges);

                const textGeometry = new TextGeometry(layers[i], {
                    font: font,
                    size: 0.06,
                    height: 0.001,
                    curveSegments: 24,
                    bevelEnabled: true,
                    bevelThickness: 0.005,
                    bevelSize: 0.002,
                });
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textMesh.position.set(-textWidth / 2, yOffset - height + 0.12 / 2, 1.05);
                scene.add(textMesh);
                textArray.push(textMesh);

                yOffset -= height + distance;
                topWidth = bottomWidth;
            }

            setTrapezoids(trapezoidArray);
            setEdges(edgeArray);
            setTexts(textArray);
        });
    }, [sceneReady, scene, camera, renderer]);

    useEffect(() => {
        if (!sceneReady || !scene || !camera || !renderer || trapezoids.length === 0) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-10, -10); // Initialize to a point outside the view
        let hoveredTrapezoid: THREE.Mesh | null = null;

        const updateMousePosition = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onMouseMove = (event: MouseEvent) => {
            updateMousePosition(event);
        };

        const onClick = (event: MouseEvent) => {
            updateMousePosition(event);
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(trapezoids);
            if (intersects.length > 0) {
                const intersectedTrapezoid = intersects[0].object as THREE.Mesh;
                const selectedLayer = intersectedTrapezoid.userData.layer;
                if (onSelect && selectedLayer) {
                    onSelect(selectedLayer);
                    setHoveredIndex(null); // Clear hover state
                }
            }
        };

        const onHover = () => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(trapezoids);
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
                const intersectedTrapezoid = intersects[0].object as THREE.Mesh;
                const index = intersectedTrapezoid.userData.index;
                if (hoveredTrapezoid !== intersectedTrapezoid) {
                    setHoveredIndex(index);
                    hoveredTrapezoid = intersectedTrapezoid;
                }
            } else {
                document.body.style.cursor = 'default';
                if (hoveredTrapezoid) {
                    setHoveredIndex(null);
                    hoveredTrapezoid = null;
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            onHover();
            renderer.render(scene, camera);
        };
        animate();

        // Initial hover check
        raycaster.setFromCamera(mouse, camera);
        onHover();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [sceneReady, scene, camera, renderer, trapezoids]);

    useEffect(() => {
        if (!sceneReady || trapezoids.length === 0) return;

        trapezoids.forEach((trapezoid, index) => {
            const material = trapezoid.material as THREE.MeshBasicMaterial;
            const edgeMaterial = edges[index].material as THREE.LineBasicMaterial;
            const textMaterial = texts[index].material as THREE.MeshBasicMaterial;

            const currentTheme = theme[themeProp || 1];

            if (index === hoveredIndex && value !== layers[index]) {
                material.color.set(currentTheme.hover); // hover
                edgeMaterial.color.set(currentTheme.selected);
                textMaterial.color.set(currentTheme.selected); // non-selected
            } else if (value === layers[index]) {
                material.color.set(currentTheme.selected); // Selected
                edgeMaterial.color.set(currentTheme.selectedEdges);
                textMaterial.color.set(0xffffff); // text same color as edge
            } else {
                material.color.set(currentTheme.default); // Default
                edgeMaterial.color.set(currentTheme.selected);
                textMaterial.color.set(currentTheme.selected); // non-selected
            }
            material.needsUpdate = true;
            edgeMaterial.needsUpdate = true;
            textMaterial.needsUpdate = true;
        });
    }, [hoveredIndex, value, themeProp, sceneReady, trapezoids, edges, texts]);

    return (
        <div className={styles.container} style={{ width: '100%', minHeight: '400px' }}>
            <div ref={mountRef} style={{ width: '100%', minHeight: '400px' }}></div>
        </div>
    );
};

export default LayerSelector3D;
