# December letter prototype

`app/page.tsx` composes this feature. `letters-experience.tsx` owns the entrance,
scroll progress and pause state. The heart gate is a native keyboard-accessible
button; the letter is inert and hidden from assistive technology until opened.
Focus moves to the greeting after the reveal.

The complete supplied December letter lives in `data/letters.ts`, including its
original paragraph breaks and KK signature. The letter is presented as nine fade-up passages, using its original
paragraph breaks. The header and city stay fixed while scrolling moves the
camera from the western riverside, across Tower Bridge, to the eastern city.
A single Lenis-smoothed scroll surface drives a fixed text layer: the previous passage fades out,
then the next fades up 18px into place. Reduced motion uses opacity only.
The text layer does not capture pointer or wheel input. Mandatory scroll snapping
is disabled; touch uses native scrolling and the camera eases toward progress.
Reduced-motion preferences bypass wheel smoothing.

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

The night sky is a static, deterministic SVG star field with a brighter CSS moon.
`london-banks.tsx` composes the two connected land approaches with roads,
townhouses, trees and street lamps. The side elevation places Southwark on the
left and Tower Hamlets on the right for storytelling; the real banks are south
and north. The orthographic camera has no horizontal yaw and pans laterally,
keeping the road and bridge deck level across every passage.
