import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Layer } from '../../types';
import { layers } from '../../constants'; // Import layers
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
    const distance = 0.035; // Set the distance between the trapezoids
    const angle = 25; // Angle in degrees for the trapezoids
    const initialTopWidth = 1.5; // Initial top width of the first trapezoid

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

        // Create an orthographic camera
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

        // Position the camera
        camera.position.set(10, 5, 20);
        camera.lookAt(0, 0, 0);
        camera.zoom = 2.5;
        camera.updateProjectionMatrix();

        let renderer: THREE.WebGLRenderer;

        try {
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            renderer.shadowMap.enabled = true; // Enable shadows
            mountRef.current.appendChild(renderer.domElement);
        } catch (error) {
            console.error("Error creating WebGL context:", error);
            return;
        }

        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true; // Enable shadows for the light
        scene.add(directionalLight);

        // Create trapezoids
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White material with standard shading

        const trapezoidArray: THREE.Mesh[] = [];
        const texts: THREE.Mesh[] = [];
        const numTrapezoids = layers.length; // Number of trapezoids based on layers length
        let yOffset = 0;
        let topWidth = initialTopWidth;

        // Compute the total height of all trapezoids plus the distances between them
        const totalHeight = layers.reduce((acc, layer) => acc + (trapezoidHeights[layer] || 1) + distance, -distance);
        yOffset = totalHeight / 2;

        // Load font
        const loader = new FontLoader();

        loader.load('/hippocampus-portal-dev/assets/fonts/Titillium_Web_Light_.json', function (font) {
            for (let i = 0; i < numTrapezoids; i++) {
                const height = trapezoidHeights[layers[i]] || 1; // Get the height for the current layer or default to 1
                const angleRad = THREE.MathUtils.degToRad(angle); // Convert angle to radians
                const bottomWidth = topWidth - 2 * height * Math.tan(angleRad); // Calculate the bottom width based on the angle

                // Define the curves for the top and bottom edges of the trapezoid
                const topCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-topWidth / 2, height / 2, 0),
                    new THREE.Vector3(0, height / 2 + 0.055, 0), // Less pronounced curve upwards
                    new THREE.Vector3(topWidth / 2, height / 2, 0),
                ]);

                let bottomCurve;

                bottomCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-bottomWidth / 2, -height / 2, 0),
                    new THREE.Vector3(0, -height / 2 + 0.055, 0), // Less pronounced curve inwards
                    new THREE.Vector3(bottomWidth / 2, -height / 2, 0),
                ]);

                const topPoints = topCurve.getPoints(20);
                const bottomPoints = bottomCurve.getPoints(20);

                const shape = new THREE.Shape();
                shape.moveTo(topPoints[0].x, topPoints[0].y);
                topPoints.forEach(point => shape.lineTo(point.x, point.y));
                bottomPoints.reverse().forEach(point => shape.lineTo(point.x, point.y));
                shape.lineTo(topPoints[0].x, topPoints[0].y);

                const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false });
                const trapezoid = new THREE.Mesh(geometry, material.clone()); // Clone the material for each trapezoid
                trapezoid.castShadow = true; // Enable shadows for the trapezoid
                trapezoid.receiveShadow = true; // Allow the trapezoid to receive shadows
                trapezoid.userData.layer = layers[i]; // Store the layer type in userData
                trapezoid.userData.index = i; // Store the index in userData

                // Position each trapezoid taking into account the height and distance
                trapezoid.position.set(0, yOffset - height / 2, -.05); // Center trapezoid based on its height
                scene.add(trapezoid);
                trapezoidArray.push(trapezoid);

                // Create text for the layer
                const textGeometry = new TextGeometry(layers[i], {
                    font: font,
                    size: 0.06,
                    height: 0.01,
                });
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }); // White color and always on top
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                // Position text at the same location as the trapezoid
                textMesh.position.set(0, yOffset - height + .21 / 2, 0.33); // Same position as the trapezoid
                textMesh.renderOrder = 999; // Ensure text renders on top
                scene.add(textMesh);
                texts.push(textMesh);

                yOffset -= height + distance; // Decrease offset by height and distance
                topWidth = bottomWidth; // The top width of the next trapezoid is the bottom width of the current trapezoid
            }

            setTrapezoids(trapezoidArray);
            setSceneReady(true); // Mark the scene as ready
        });

        // Create a plane to catch shadows
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -5;
        plane.receiveShadow = true;
        scene.add(plane);

        // Raycaster setup
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

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            onHover();

            renderer.render(scene, camera);
        };

        animate();
        // Clean up
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [distance, onSelect, value]);

    useEffect(() => {
        if (sceneReady && trapezoids.length > 0) { // Ensure scene is ready before updating trapezoids
            trapezoids.forEach((trapezoid, index) => {
                const material = trapezoid.material as THREE.MeshStandardMaterial;

                if (index === hoveredIndex && value !== layers[index]) {
                    material.color.set(0x778CA9); // Blue color for hover
                    material.transparent = false;
                    material.opacity = 1;
                } else if (value === layers[index]) {
                    material.color.set(0x5BC4EE); // Yellow color for selected
                    material.transparent = false;
                    material.opacity = 1;
                } else if (index !== hoveredIndex) {
                    material.color.set(0x96A7BE); // White color for default
                    material.transparent = false;
                    material.opacity = 1;
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