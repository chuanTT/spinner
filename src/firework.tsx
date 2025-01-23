import { useCallback, useEffect, useRef } from "react";
import { Firework, Particle, random } from "./common/firework";

const FireworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworks = useRef<Firework[]>([]);
  const particles = useRef<Particle[]>([]);

  // create particle group/explosion
  const createParticles = useCallback((x: number, y: number, hue: number) => {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    let particleCount = 30;
    while (particleCount--) {
      const particle = new Particle(x, y, hue);
      particles.current.push(particle);
    }
  }, []);


  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if(!ctx) return
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    let hue = 120;
    const limiterTotal = 5;
    let limiterTick = 0;
    const timerTotal = 60;
    let timerTick = 0;
    const mousedown = false;
    const mx = 0
    const my = 0

    canvas.width = cw;
    canvas.height = ch;

    function loop(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
      // this function will run endlessly with requestAnimationFrame
      window.requestAnimationFrame(() => loop(ctx, cw, ch));

      // increase the hue to get different colored fireworks over time
      hue += 0.5;

      // normally, clearRect() would be used to clear the canvas
      // we want to create a trailing effect though
      // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
      ctx.globalCompositeOperation = "destination-out";
      // decrease the alpha property to create more prominent trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, cw, ch);
      // change the composite operation back to our main mode
      // lighter creates bright highlight points as the fireworks and particles overlap each other
      ctx.globalCompositeOperation = "lighter";

      // loop over each firework, draw it, update it
      let iFire = fireworks.current.length;
      while (iFire--) {
        fireworks.current[iFire]?.draw(ctx, hue);
        fireworks.current[iFire]?.update(
          fireworks.current,
          createParticles,
          iFire,
          hue
        );
      }

      // loop over each particle, draw it, update it
      let iPart = particles.current.length;
      while (iPart--) {
        particles.current[iPart].draw(ctx);
        particles.current[iPart].update();
      }

      // launch fireworks automatically to random coordinates, when the mouse isn't down
      if (timerTick >= timerTotal) {
        if (!mousedown) {
          // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
          fireworks.current.push(
            new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2))
          );
          timerTick = 0;
        }
      } else {
        timerTick++;
      }

      // limit the rate at which fireworks get launched when mouse is down
      if (limiterTick >= limiterTotal) {
        if (mousedown) {
          // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
          fireworks.current.push(new Firework(cw / 2, ch, mx, my));
          limiterTick = 0;
        }
      } else {
        limiterTick++;
      }
    }

    loop(ctx, cw, ch)
  }, [createParticles]);

  return <canvas ref={canvasRef} className="fixed left-0 top-0 z-[1] cursor-crosshair"></canvas>;
};

export default FireworkCanvas;
