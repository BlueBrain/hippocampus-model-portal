import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layer } from '../../types';
import { layers } from '../../constants';
import styles from './styles.module.scss';

type LayerSelectProps3D = {
    value?: Layer;
    onSelect?: (layer: Layer) => void;
};

const createCurvedRectangle = (bottomWidth, topWidth, height, depth) => {
    const shape = new THREE.Shape();

    // Curved bottom (inward)
    const bottomCurve = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(-bottomWidth / 2, 0),
        new THREE.Vector2(0, height / 8),  // Adjusted control point for smoother curve
        new THREE.Vector2(bottomWidth / 2, 0)
    );
    const bottomPoints = bottomCurve.getPoints(20);
    bottomPoints.forEach((point, index) => {
        if (index === 0) {
            shape.moveTo(point.x, point.y);
        } else {
            shape.lineTo(point.x, point.y);
        }
    });

    // Curved top (outward)
    const topCurve = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(topWidth / 2, height),
        new THREE.Vector2(0, height + height / 4),  // Adjusted control point for smoother curve
        new THREE.Vector2(-topWidth / 2, height)
    );
    const topPoints = topCurve.getPoints(20);
    topPoints.forEach(point => shape.lineTo(point.x, point.y));

    shape.lineTo(-bottomWidth / 2, 0);

    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: false
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};


const LayerSelector3D: React.FC<LayerSelectProps3D> = ({
    value: currentLayer,
    onSelect = () => { },
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const shapesRef = useRef<THREE.Mesh[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const selectLayer = (layer: Layer): void => onSelect(layer);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        const frustumSize = 10;
        const camera = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setClearColor(0x111111);
        canvasRef.current.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0x888888, 1));
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(10, 10, 10).normalize();
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, .5);
        directionalLight2.position.set(-10, -10, 60).normalize();
        scene.add(directionalLight2);

        // Rectangles with Arc
        const distanceBetweenShapes = 0.05;
        const shapeHeights = [0.896, 1.71164, 0.36, 1.032];
        const initialBottomWidth = 2.0;
        const depth = 1;
        const customAngle = 0.3;

        let cumulativeHeight = 0;
        let bottomWidth = initialBottomWidth;

        const angle = customAngle;
        const reversedHeights = [...shapeHeights].reverse();

        shapesRef.current = layers.map((layer, index) => {
            const height = reversedHeights[index];
            const topWidth = bottomWidth + 2 * height * Math.tan(angle);
            const geometry = createCurvedRectangle(bottomWidth, topWidth, height, depth);
            const material = new THREE.MeshPhongMaterial({ color: 0xBEC9D7 });
            const shape = new THREE.Mesh(geometry, material);

            shape.position.y = cumulativeHeight;
            shape.position.x = depth / 2;
            cumulativeHeight += height + distanceBetweenShapes;

            bottomWidth = topWidth;

            shape.userData = { layer, index };
            shape.onClick = () => selectLayer(layer);

            scene.add(shape);
            return shape;
        });

        const totalHeight = cumulativeHeight - distanceBetweenShapes;
        scene.position.y = -totalHeight / 2;

        camera.position.set(10, 5, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.zoom = 1.75;
        camera.updateProjectionMatrix();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event: MouseEvent) => {
            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(shapesRef.current);

            if (intersects.length > 0) {
                const hoveredShape = intersects[0].object as THREE.Mesh;
                setHoveredIndex(hoveredShape.userData.index);
                canvasRef.current.style.cursor = 'pointer';
            } else {
                setHoveredIndex(null);
                canvasRef.current.style.cursor = 'default';
            }
        };

        const onClick = (event: MouseEvent) => {
            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(shapesRef.current);

            if (intersects.length > 0) {
                const clickedShape = intersects[0].object as THREE.Mesh;
                const layer = clickedShape.userData.layer as Layer;
                selectLayer(layer);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (canvasRef.current) {
                const aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
                camera.left = (frustumSize * aspect) / -2;
                camera.right = (frustumSize * aspect) / 2;
                camera.top = frustumSize / 2;
                camera.bottom = frustumSize / -2;
                camera.updateProjectionMatrix();
                renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, [selectLayer]);

    useEffect(() => {
        shapesRef.current.forEach((shape, index) => {
            const material = shape.material as THREE.MeshPhongMaterial;

            if (index === hoveredIndex && currentLayer !== layers[index]) {
                material.color.set(0x5CC4EE);
                material.transparent = true;
                material.opacity = 0.95;
            } else if (currentLayer === layers[index]) {
                material.color.set(0x5CC4EE);
                material.transparent = false;
                material.opacity = 1;
            } else {
                material.color.set(0xBEC9D7);
                material.transparent = false;
                material.opacity = 1;
            }

            material.needsUpdate = true;
        });
    }, [currentLayer, hoveredIndex]);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {layers.map(layer => (
                <div
                    key={layer.name}
                    className={`${styles.layer} ${layer === currentLayer ? styles.active : ''}`}
                    onClick={() => onSelect(layer)}
                >
                    {layer.name}
                </div>
            ))}
        </div>
    );
};

export default LayerSelector3D;
