# December letter prototype

`app/page.tsx` composes this feature. `letters-experience.tsx` owns the entrance,
scroll progress and pause state. The heart gate is a native keyboard-accessible
button; the letter is inert and hidden from assistive technology until opened.
Focus moves to the greeting after the reveal.

The complete supplied December letter lives in `data/letters.ts`, including its
original paragraph breaks and KK signature. The letter is presented as nine native scroll-snap passages, using its original
paragraph breaks. The header and city stay fixed while scrolling moves the
camera from the western riverside, across Tower Bridge, to the eastern city.
Invisible snap targets drive a fixed text layer: the previous passage fades out,
then the next fades up 18px into place. Reduced motion uses opacity only.
Oversized text can scroll within the reading area when needed.

The client-only R3F canvas uses declarative geometry with automatic unmount
cleanup. `bridge.tsx` owns the bridge model; `london-scene.tsx` owns scenery,
traffic and the camera. Ten small vehicles use simple meshes; instancing can be
introduced if the scene grows. Pixel density is capped at 1.5. Native scroll progress within the letter container
controls the camera; text remains accessible HTML.

Reduced motion initially uses `scene-fallback.tsx`, a static Tower Bridge
illustration. Play remains available and explicitly enables the live scene and
snow, while keeping the heart and passage transitions reduced.
The same illustration remains behind the canvas while loading or when the
scene boundary catches a renderer failure. CSS snowfall respects reduced motion and inherits the pause state. Warm windows
use emissive materials against a cool evening palette. The pause button stops snow, traffic,
boat movement and the render loop. The previous timeline files remain available
but are no longer mounted by the home route.

Check with `bunx tsc --noEmit`, ESLint on touched files, and `bun run build`.
The build requires access to Google Fonts, as configured in the existing layout.
