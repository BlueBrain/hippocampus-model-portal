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
    const distance = 0.1; // Set the distance between the cubes

    const cubeHeights = {
        SLM: 0.224,
        SR: 0.42791,
        SP: 0.090,
        SO: 0.258,
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
        camera.position.set(10, 5, 15);
        camera.lookAt(0, 0, 0);
        camera.zoom = 2.5;
        camera.updateProjectionMatrix();

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true; // Enable shadows
        mountRef.current.appendChild(renderer.domElement);

        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true; // Enable shadows for the light
        scene.add(directionalLight);

        // Create cubes
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White material with standard shading

        const cubes: THREE.Mesh[] = [];
        const texts: THREE.Mesh[] = [];
        const numCubes = layers.length; // Number of cubes based on layers length
        let yOffset = 0;

        // Compute the total height of all cubes plus the distances between them
        const totalHeight = layers.reduce((acc, layer) => acc + (cubeHeights[layer] || 1) + distance, -distance);
        yOffset = totalHeight / 2;

        // Load font
        const loader = new FontLoader();

        loader.load('/hippocampus-portal-dev/assets/fonts/optimer_bold.typeface.json', function (font) {
            for (let i = 0; i < numCubes; i++) {
                const height = cubeHeights[layers[i]] || 1; // Get the height for the current layer or default to 1
                const geometry = new THREE.BoxGeometry(1, height, 1); // Adjust the size of the cubes
                const cube = new THREE.Mesh(geometry, material.clone()); // Clone the material for each cube
                cube.castShadow = true; // Enable shadows for the cube
                cube.receiveShadow = true; // Allow the cube to receive shadows
                cube.userData.layer = layers[i]; // Store the layer type in userData
                cube.userData.index = i; // Store the index in userData

                // Position each cube taking into account the height and distance
                cube.position.set(0, yOffset - height / 2, 0); // Center cube based on its height
                scene.add(cube);
                cubes.push(cube);

                // Create text for the layer
                const textGeometry = new TextGeometry(layers[i], {
                    font: font,
                    size: 0.1,
                    height: 0.02,
                });
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false }); // Red color and always on top
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                // Position text at the same location as the cube
                textMesh.position.set(0, yOffset - height / 2, 0); // Same position as the cube
                textMesh.renderOrder = 999; // Ensure text renders on top
                scene.add(textMesh);
                texts.push(textMesh);

                yOffset -= height + distance; // Decrease offset by height and distance
            }
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
        let hoveredCube: THREE.Mesh | null = null;

        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onClick = (event: MouseEvent) => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cubes);

            if (intersects.length > 0) {
                const intersectedCube = intersects[0].object as THREE.Mesh;
                const selectedLayer = intersectedCube.userData.layer;
                if (onSelect && selectedLayer) {
                    onSelect(selectedLayer);
                }
            }
        };

        useEffect(() => {
            cubes.forEach((cube, index) => {
                const material = cube.material as THREE.MeshStandardMaterial;

                if (index === hoveredIndex && value !== layers[index]) {
                    material.color.set(0x0000ff); // Blue color for hover
                    material.transparent = false;
                    material.opacity = 1;
                } else if (value === layers[index]) {
                    material.color.set(0xffff00); // Yellow color for selected
                    material.transparent = false;
                    material.opacity = 1;
                } else {
                    material.color.set(0xffffff); // White color for default
                    material.transparent = false;
                    material.opacity = 1;
                }

                material.needsUpdate = true;
            });
        }, [hoveredIndex, value]);

        const onHover = () => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cubes);

            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
                const intersectedCube = intersects[0].object as THREE.Mesh;
                const index = intersectedCube.userData.index;
                if (hoveredCube !== intersectedCube) {
                    setHoveredIndex(index);
                    hoveredCube = intersectedCube;
                }
            } else {
                document.body.style.cursor = 'default';
                setHoveredIndex(null);
                hoveredCube = null;
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            onHover();
            texts.forEach(text => {
                text.lookAt(camera.position); // Make text always face the camera
            });
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
    }, [distance, onSelect, value, hoveredIndex]);

    return (
        <div className={styles.container} style={{ width: '100%', height: '400px' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default LayerSelector3D;
