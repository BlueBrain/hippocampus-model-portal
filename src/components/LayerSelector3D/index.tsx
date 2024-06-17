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

    const distance = 0;
    const angle = 13;
    const initialTopWidth = 1.6;
    const edgeThickness = 1;

    const theme = {
        1: { default: 0x44405B, hover: 0x0745F6C, selected: 0xA37D7C },
        2: { default: 0x000000, hover: 0xEFAE97, selected: 0xA37E7C },
        3: { default: 0x000000, hover: 0xEFAE97, selected: 0xA37E7C },
        4: { default: 0x000000, hover: 0xEFAE97, selected: 0xA37E7C },
        5: { default: 0x000000, hover: 0xEFAE97, selected: 0xA37E7C },
    };

    const trapezoidHeights = {
        SLM: 0.224 * 1.6,
        SR: 0.42791 * 1.6,
        SP: 0.090 * 1.6,
        SO: 0.258 * 1.6,
    };

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x313354);

        const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        const frustumSize = 5;

        const camera = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        camera.position.set(0, -10, 90);
        camera.lookAt(0, 0, 1);
        camera.zoom = 2.5;
        camera.updateProjectionMatrix();

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            mountRef.current.appendChild(renderer.domElement);
        } catch (error) {
            console.error("Error creating WebGL context:", error);
            return;
        }

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
            for (let I = 0; I < numTrapezoids; I++) {
                const height = trapezoidHeights[layers[I]] || 1;
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
                trapezoid.userData.layer = layers[I];
                trapezoid.userData.index = I;

                trapezoid.position.set(0, yOffset - height / 2, 0.05);
                scene.add(trapezoid);
                trapezoidArray.push(trapezoid);

                const edgeGeometry = new THREE.EdgesGeometry(geometry);
                const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: edgeThickness });
                const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
                edges.position.set(0, yOffset - height / 2, 0.05);
                scene.add(edges);
                edgeArray.push(edges);

                const textGeometry = new TextGeometry(layers[I], { font: font, size: 0.06, height: 0.001 });
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

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
            setSceneReady(true);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredTrapezoid: THREE.Mesh | null = null;

        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onClick = (event: MouseEvent) => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(trapezoids);
            if (intersects.length > 0) {
                const intersectedTrapezoid = intersects[0].object as THREE.Mesh;
                const selectedLayer = intersectedTrapezoid.userData.layer;
                if (onSelect && selectedLayer) {
                    onSelect(selectedLayer);
                    setHoveredIndex(null); // Force re-render
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

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [distance, onSelect, value, themeProp]);

    useEffect(() => {
        if (sceneReady && trapezoids.length > 0) {
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
                    edgeMaterial.color.set(currentTheme.hover);
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
        }
    }, [hoveredIndex, value, trapezoids, edges, texts, sceneReady, themeProp]);

    return (
        <div className={styles.container} style={{ width: '100%', height: '400px' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default LayerSelector3D;