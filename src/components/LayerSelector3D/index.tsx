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
};

const LayerSelector3D: React.FC<LayerSelectProps3D> = ({ value, onSelect }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [trapezoids, setTrapezoids] = useState<THREE.Mesh[]>([]);
    const [sceneReady, setSceneReady] = useState(false);

    const distance = 0.025;
    const angle = 20;
    const initialTopWidth = 1.5;

    // Heights of different trapezoids
    const trapezoidHeights = {
        SLM: 0.224 * 1.3,
        SR: 0.42791 * 1.3,
        SP: 0.090 * 1.3,
        SO: 0.258 * 1.3,
    };

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        const frustumSize = 5;

        // Orthographic camera setup
        const camera = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        camera.position.set(5, 2, 10);
        camera.lookAt(0, 0, 0);
        camera.zoom = 2.5;
        camera.updateProjectionMatrix();

        // Renderer setup
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

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Material for trapezoids
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const trapezoidArray: THREE.Mesh[] = [];
        const texts: THREE.Mesh[] = [];
        const numTrapezoids = layers.length;
        let yOffset = 0;
        let topWidth = initialTopWidth;

        const totalHeight = layers.reduce((acc, layer) => acc + (trapezoidHeights[layer] || 1) + distance, -distance);
        yOffset = totalHeight / 2;

        // Load font for text
        const loader = new FontLoader();
        loader.load('/hippocampus-portal-dev/assets/fonts/Titillium_Web_Light_.json', (font) => {
            for (let i = 0; i < numTrapezoids; i++) {
                const height = trapezoidHeights[layers[i]] || 1;
                const angleRad = THREE.MathUtils.degToRad(angle);
                const bottomWidth = topWidth - 2 * height * Math.tan(angleRad);

                // Define top and bottom edges of the trapezoid
                const topCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-topWidth / 2, height / 2, 0),
                    new THREE.Vector3(0, height / 2 + 0.065, 0),
                    new THREE.Vector3(topWidth / 2, height / 2, 0),
                ]);

                const bottomCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-bottomWidth / 2, -height / 2, 0),
                    new THREE.Vector3(0, -height / 2 + 0.065, 0),
                    new THREE.Vector3(bottomWidth / 2, -height / 2, 0),
                ]);

                // Create trapezoid shape
                const topPoints = topCurve.getPoints(20);
                const bottomPoints = bottomCurve.getPoints(20);

                const shape = new THREE.Shape();
                shape.moveTo(topPoints[0].x, topPoints[0].y);
                topPoints.forEach((point) => shape.lineTo(point.x, point.y));
                bottomPoints.reverse().forEach((point) => shape.lineTo(point.x, point.y));
                shape.lineTo(topPoints[0].x, topPoints[0].y);

                const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
                const trapezoid = new THREE.Mesh(geometry, material.clone());
                trapezoid.castShadow = true;
                trapezoid.receiveShadow = true;
                trapezoid.userData.layer = layers[i];
                trapezoid.userData.index = i;

                trapezoid.position.set(0, yOffset - height / 2, 0.05);
                scene.add(trapezoid);
                trapezoidArray.push(trapezoid);

                // Create text for the layer
                // Create text for the layer
                const textGeometry = new TextGeometry(layers[i], { font: font, size: 0.06, height: 0.01 });
                textGeometry.computeBoundingBox(); // Compute the bounding box of the text
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x; // Calculate the width of the text

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                // Center the text
                textMesh.position.set(-textWidth / 2, yOffset - height + 0.18 / 2, 0.25);
                scene.add(textMesh);
                texts.push(textMesh);

                yOffset -= height + distance;
                topWidth = bottomWidth;
            }

            setTrapezoids(trapezoidArray);
            setSceneReady(true);
        });

        // Raycaster setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredTrapezoid: THREE.Mesh | null = null;

        // Mouse move handler
        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        // Click handler
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

        // Hover handler
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

        // Add event listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            onHover();
            renderer.render(scene, camera);
        };
        animate();

        // Clean up on component unmount
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [distance, onSelect, value]);

    // Update trapezoid colors based on state
    useEffect(() => {
        if (sceneReady && trapezoids.length > 0) {
            trapezoids.forEach((trapezoid, index) => {
                const material = trapezoid.material as THREE.MeshStandardMaterial;
                if (index === hoveredIndex && value !== layers[index]) {
                    material.color.set(0x778CA9); // Hovered
                } else if (value === layers[index]) {
                    material.color.set(0xEFAE97); // Selected
                } else if (index !== hoveredIndex) {
                    material.color.set(0x96A7BE); // Default
                }
                material.needsUpdate = true;
            });
        }
    }, [hoveredIndex, value, trapezoids, sceneReady]);

    return (
        <div className={styles.container} style={{ width: '100%', height: '400px' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default LayerSelector3D;
