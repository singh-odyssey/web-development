// Three.js Animation for Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Check if the canvas exists
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Initialize Three.js scene
    let scene, camera, renderer, geometry;
    let mouseX = 0, mouseY = 0;
    let particleSystem;
    let clock;
    let isMouseMoving = false;
    let mouseTimeout;
    
    // Set up window dimensions
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    
    // Initialize the 3D scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Set up camera with wider field of view for better coverage
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        
        // Initialize clock
        clock = new THREE.Clock();
        
        // Create particle geometry
        geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const color = new THREE.Color();
        const sizes = [];
        
        // Calculate particle count based on screen size for better performance
        const isMobile = window.innerWidth < 768;
        const numParticles = isMobile ? 1500 : 3000; // More particles for desktop
        
        // Adjust spread based on screen size to ensure full coverage
        const spreadX = window.innerWidth * 1.5; // 150% of screen width
        const spreadY = window.innerHeight * 1.5; // 150% of screen height
        const spreadZ = 1000;
        
        for (let i = 0; i < numParticles; i++) {
            // Position particles to cover the entire screen area
            const x = (Math.random() - 0.5) * spreadX;
            const y = (Math.random() - 0.5) * spreadY;
            const z = (Math.random() - 0.5) * spreadZ;
            
            vertices.push(x, y, z);
            
            // Randomize sizes for more dynamic effect
            sizes.push(Math.random() * 4 + 1);
            
            // Create a more vibrant color palette
            const hue = Math.random() * 0.3 + 0.55; // Blue to purple range
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.5 + Math.random() * 0.4;
            
            color.setHSL(hue, saturation, lightness);
            colors.push(color.r, color.g, color.b);
        }
        
        // Set attributes
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        // Create point material with better settings
        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create particles system
        particleSystem = new THREE.Points(geometry, particleMaterial);
        scene.add(particleSystem);
        
        // Set up renderer with better settings
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        
        // Add event listeners
        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('touchmove', onDocumentTouchMove);
        window.addEventListener('resize', onWindowResize);
    }
    
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function onDocumentMouseMove(event) {
        // Update mouse position
        mouseX = (event.clientX - windowHalfX) * 0.1;
        mouseY = (event.clientY - windowHalfY) * 0.1;
        
        // Mouse interaction with particles
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Apply mouse effects to particles
        if (particleSystem) {
            const positions = particleSystem.geometry.attributes.position.array;
            const mouseForce = 50;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                
                // Convert mouse to world coordinates
                const mouseWorldX = mouse.x * window.innerWidth * 0.75;
                const mouseWorldY = mouse.y * window.innerHeight * 0.75;
                
                // Calculate distance to mouse
                const dx = x - mouseWorldX;
                const dy = y - mouseWorldY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Apply force if within range
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    positions[i] += dx * force * 0.1;
                    positions[i + 1] += dy * force * 0.1;
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Set mouse moving state
        isMouseMoving = true;
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 2000);
    }
    
    function onDocumentTouchMove(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            mouseX = (touch.clientX - windowHalfX) * 0.1;
            mouseY = (touch.clientY - windowHalfY) * 0.1;
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    
    function render() {
        const time = clock.getElapsedTime();
        
        // Subtle camera movement based on mouse position
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        // Gentle rotation and floating animation
        if (particleSystem) {
            particleSystem.rotation.y = time * 0.02;
            particleSystem.rotation.x = Math.sin(time * 0.01) * 0.1;
            
            // Add organic floating movement
            const positions = particleSystem.geometry.attributes.position.array;
            const originalPositions = particleSystem.geometry.userData.originalPositions;
            
            if (!originalPositions) {
                // Store original positions on first render
                particleSystem.geometry.userData.originalPositions = [...positions];
            } else {
                // Apply floating animation
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] = originalPositions[i] + Math.sin(time * 0.5 + originalPositions[i + 1] * 0.01) * 10;
                    positions[i + 1] = originalPositions[i + 1] + Math.cos(time * 0.6 + originalPositions[i] * 0.01) * 10;
                    positions[i + 2] = originalPositions[i + 2] + Math.sin(time * 0.4 + originalPositions[i] * 0.01) * 15;
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        }
        
        renderer.render(scene, camera);
    }
    
    // Initialize and start animation
    init();
    animate();
});
