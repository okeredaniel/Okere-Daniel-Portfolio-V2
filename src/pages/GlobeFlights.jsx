import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

const LAGOS = [6.5244, 3.3792];

const defaultMarkers = [
  { id: "lagos", location: LAGOS },
  { id: "london", location: [51.5074, -0.1278] },
  { id: "geneva", location: [46.2044, 6.1432] },
  { id: "dubai", location: [25.2048, 55.2708] },
  { id: "singapore", location: [1.3521, 103.8198] },
  { id: "nyc", location: [40.7128, -74.006] },
];

const defaultArcs = defaultMarkers
  .filter((m) => m.id !== "lagos")
  .map((m) => ({ id: `arc-${m.id}`, from: LAGOS, to: m.location }));

export default function GlobeFlights({
  arcs = defaultArcs,
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.28,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 14000,
        mapBrightness: 3.5,
        baseColor: [0.09, 0.08, 0.07],
        markerColor: [0.302, 0.882, 0.659],
        glowColor: [0.15, 0.13, 0.11],
        markerElevation: 0.06,
        markers: markers.map((m) => ({ location: m.location, size: 0.045, id: m.id })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor: [0.302, 0.882, 0.659],
        arcWidth: 0.6,
        arcHeight: 0.28,
        opacity: 0.85,
        onRender: (state) => {
          if (!isPausedRef.current) phi += speed;
          state.phi = phi + phiOffsetRef.current + dragOffset.current.phi;
          state.theta = 0.28 + thetaOffsetRef.current + dragOffset.current.theta;
        },
      });

      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (globe) globe.destroy();
    };
  }, [markers, arcs, speed]);

  return (
    <div className={`globe-wrap ${className}`}>
      <canvas ref={canvasRef} onPointerDown={handlePointerDown} className="globe-canvas" />
    </div>
  );
}