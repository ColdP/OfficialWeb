import { createGlassScene } from '@glass-sdk/liquid-glass/dom';
import '@glass-sdk/liquid-glass/styles.css';

function initLiquidGlass() {
    const sceneRoot = document.getElementById('liquid-glass-scene');
    const content = document.getElementById('page-content');
    const navigation = document.querySelector('.floating-surface');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!sceneRoot || !content || !navigation || !mobileMenu) return;

    const scene = createGlassScene(sceneRoot, {
        maxSurfaces: 4,
        onDiagnostic: (diagnostic) => {
            sceneRoot.dataset.glassReady = diagnostic.error ? 'false' : String(diagnostic.maps > 0);
        }
    });

    scene.setContent(content);
    scene.addSurface(navigation, {
        material: 'clear',
        appearance: 'light',
        radius: 'capsule',
        refraction: 96,
        fluid: true,
        interactive: true
    });
    scene.addSurface(mobileMenu, {
        material: 'clear',
        appearance: 'light',
        radius: 40,
        refraction: 96,
        fluid: true,
        interactive: true
    });
    // Keep the material sampler responsive at a 120Hz cadence where the display allows it.
    const samplingInterval = window.setInterval(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 1000 / 120);

    window.addEventListener('pagehide', () => {
        window.clearInterval(samplingInterval);
        scene.dispose();
    }, { once: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass, { once: true });
} else {
    initLiquidGlass();
}
