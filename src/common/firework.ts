export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const calculateDistance = (
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
) => {
  const xDistance = p1x - p2x;
  const yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

export class Particle {
  x: number;
  y: number;
  coordinates: number[][];
  coordinateCount: number;
  angle: number;
  speed: number;
  friction: number;
  gravity: number;
  hue: number;
  brightness: number;
  alpha: number;
  decay: number;
  constructor(x: number, y: number, hue: number) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  // Update the particle's position, alpha, and other properties
  update() {
    this.coordinates.push([this.x, this.y]);
    if (this.coordinates.length > this.coordinateCount) {
      this.coordinates.shift();
    }

    // Update position
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    // Apply friction
    this.speed *= this.friction;
    this.alpha -= this.decay;
  }

  // Draw the particle on the canvas
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[0][0], this.coordinates[0][1]);
    this.coordinates.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export class Firework {
  x: number;
  y: number;
  sx: number;
  sy: number;

  tx: number;
  ty: number;

  distanceTraveled: number;
  distanceToTarget: number;
  coordinates: number[][];
  coordinateCount: number;
  angle: number;
  speed: number;
  acceleration: number;
  brightness: number;
  targetRadius: number;
  constructor(sx: number, sy: number, tx: number, ty: number) {
    this.x = sx;
    this.y = sy;

    this.sx = sx;
    this.sy = sy;

    this.tx = tx;
    this.ty = ty;

    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;

    this.coordinates = [];
    this.coordinateCount = 3;

    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
  }

  update(
    fireworks: Firework[],
    createParticles: (x: number, y: number, hue: number) => void,
    index: number,
    hue: number
  ) {
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
      this.targetRadius += 0.3;
    } else {
      this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    const vx = Math.cos(this.angle) * this.speed,
      vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(
      this.sx,
      this.sy,
      this.x + vx,
      this.y + vy
    );

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty, hue);
      // remove the firework, use the index passed into the update function to determine which to remove
      fireworks.splice(index, 1);
    } else {
      // target not reached, keep traveling
      this.x += vx;
      this.y += vy;
    }
  }

  draw(ctx: CanvasRenderingContext2D, hue: number) {
      ctx.beginPath();
      // move to the last tracked coordinate in the set, then draw a line to the current x and y
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
      ctx.stroke();
      ctx.beginPath();
      // draw the target for this firework with a pulsing circle
      ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      ctx.stroke();
  }
}
