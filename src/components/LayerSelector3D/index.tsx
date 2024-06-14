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
    const [sceneReady, setSceneReady] = useState(false);

    const distance = 0;
    const angle = 17.5;
    const initialTopWidth = 1.8;
    const edgeThickness = .5; // Variable to control the thickness of the edges

    const theme = {
        1: 0xA37E7C,
        2: "#EA9088",
        3: "#CC8A99",
        4: "#9E98AE",
        5: "#8398B5"
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
            renderer.shadowMap.enabled = true;
            mountRef.current.appendChild(renderer.domElement);
        } catch (error) {
            console.error("Error creating WebGL context:", error);
            return;
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, -  7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const trapezoidArray: THREE.Mesh[] = [];
        const edgeArray: THREE.LineSegments[] = [];
        const texts: THREE.Mesh[] = [];
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
                trapezoid.castShadow = false;
                trapezoid.receiveShadow = false;
                trapezoid.userData.layer = layers[i];
                trapezoid.userData.index = i;

                trapezoid.position.set(0, yOffset - height / 2, 0.05);
                scene.add(trapezoid);
                trapezoidArray.push(trapezoid);

                const edgeGeometry = new THREE.EdgesGeometry(geometry);
                const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: edgeThickness });
                const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
                edges.position.set(0, yOffset - height / 2, 0.05);
                scene.add(edges);
                edgeArray.push(edges);

                const textGeometry = new TextGeometry(layers[i], { font: font, size: 0.06, height: 0.001 });
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: true });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textMesh.position.set(-textWidth / 2, yOffset - height + 0.12 / 2, 1.05);
                scene.add(textMesh);
                texts.push(textMesh);

                yOffset -= height + distance;
                topWidth = bottomWidth;
            }

            setTrapezoids(trapezoidArray);
            setEdges(edgeArray);
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
    }, [distance, onSelect, value]);

    useEffect(() => {
        if (sceneReady && trapezoids.length > 0) {
            trapezoids.forEach((trapezoid, index) => {
                const material = trapezoid.material as THREE.MeshStandardMaterial;
                const edgeMaterial = edges[index].material as THREE.LineBasicMaterial;

                material.transparent = false;

                material.opacity = 0.2;


                if (index === hoveredIndex && value !== layers[index]) {
                    material.color.set(themeProp && theme[themeProp]); // hover
                    edgeMaterial.color.set(themeProp ? theme[themeProp] : 0xEFAE97);
                } else if (value === layers[index]) {
                    material.color.set(themeProp ? theme[themeProp] : 0xA37E7C); // Selected
                    edgeMaterial.color.set(themeProp ? theme[themeProp] : 0xEFAE97);
                } else if (index !== hoveredIndex) {
                    material.color.set(0x000000); // Default
                    material.emissive.set(0x44405B); // Set emission to black
                    edgeMaterial.color.set(themeProp ? theme[themeProp] : 0xEFAE97);
                }
                material.needsUpdate = true;
                edgeMaterial.needsUpdate = true;
            });
        }
    }, [hoveredIndex, value, trapezoids, edges, sceneReady]);


    return (
        <div className={styles.container} style={{ width: '100%', height: '400px' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default LayerSelector3D;
