const Diagnostics = require('Diagnostics');

const RAD2DEG = 57.2957795131;
const DEG2RAD = 0.01745329251;
const PI = 3.14159265359;
const TWO_PI = 6.28318530718;

/**
 * @class EulerAngle
 * @constructor
 *
 * @param { Array | Quaternion | Number= } x roll in DEGREES
 * @param { Number= } y pitch in DEGREES
 * @param { Number= } z yaw in DEGREES
 * @property { number } x - roll
 * @property { number } y - pitch
 * @property { number } z - yaw
 *
 * @version 1.0
 * @author Tomas Pietravallo
 */
export const EulerAngle = function EulerAngle(x, y, z) {
  if (x instanceof Array) {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2];
  } else if (x instanceof Quaternion) {
    return x.toEulerAngles();
  } else {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
};
/** @param { EulerAngle | Array.<Number> | Number= } x * @returns { EulerAngle } Vector */
EulerAngle.prototype.add = function (x) {
  if (x instanceof EulerAngle) {
    this.x += x.x || 0;
    this.y += x.y || 0;
    this.z += x.z || 0;
  } else if (x instanceof Quaternion) {
    return this.add(x.toEulerAngles());
  } else if (x instanceof Array) {
    this.x += x[0] || 0;
    this.y += x[1] || 0;
    this.z += x[2] || 0;
  } else if (typeof x == 'number') {
    this.x += x || 0;
    this.y += x || 0;
    this.z += x || 0;
  }
  return this;
};
/** @param { EulerAngle | Array.<Number> | Number= } x * @returns { EulerAngle } Vector */
EulerAngle.prototype.sub = function (x) {
  if (x instanceof EulerAngle) {
    this.x -= x.x || 0;
    this.y -= x.y || 0;
    this.z -= x.z || 0;
  } else if (x instanceof Array) {
    this.x -= x[0] || 0;
    this.y -= x[1] || 0;
    this.z -= x[2] || 0;
  } else if (typeof x == 'number') {
    this.x -= x || 0;
    this.y -= x || 0;
    this.z -= x || 0;
  }
  return this;
};
/** @param { EulerAngle | Array.<Number> | Number= } x * @returns { EulerAngle } Vector */
EulerAngle.prototype.mul = function (x) {
  if (x instanceof EulerAngle) {
    this.x *= x.x;
    this.y *= x.y;
    this.z *= x.z;
  } else if (x instanceof Array) {
    this.x *= x[0];
    this.y *= x[1];
    this.z *= x[2];
  } else if (typeof x == 'number') {
    this.x *= x;
    this.y *= x;
    this.z *= x;
  }
  return this;
};
/** @param { EulerAngle | Array.<Number> | Number } x * @returns { EulerAngle } Vector */
EulerAngle.prototype.div = function (x) {
  if (x instanceof EulerAngle) {
    if (
      Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
    ) {
      if (x.x === 0 || x.y === 0 || x.z === 0) {
        Diagnostics.log('EulerAngle.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'EulerAngle.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    this.x /= x.x;
    this.y /= x.y;
    this.z /= x.z;
    return this;
  } else if (x instanceof Array) {
    if (
      x.every((value) => Number.isFinite(value)) &&
      x.every((value) => typeof value === 'number')
    ) {
      if (x[0] === 0 || x[1] === 0 || x[2] === 0) {
        Diagnostics.log('EulerAngle.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'EulerAngle.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    this.x /= x[0];
    this.y /= x[1];
    this.z /= x[2];
  } else if (typeof x == 'number') {
    if (Number.isFinite(x) && typeof x == 'number') {
      if (x === 0) {
        Diagnostics.log('EulerAngle.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'EulerAngle.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
  }
};
/** @param x { Array.<Number> | Number= } * @param { Number= } y * @param { Number= } z * @returns { EulerAngle } EulerAngle */
EulerAngle.prototype.fromRadiants = function (x, y, z) {
  if (x instanceof Array) {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2];
  } else {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  this.x *= RAD2DEG;
  this.y *= RAD2DEG;
  this.z *= RAD2DEG;

  return this;
};
/** @description Converts EulerAngle to Quaternion* @returns { Quaternion } Quaternion */
EulerAngle.prototype.toQuaternion = function () {
  const yaw = this.z * DEG2RAD;
  const pitch = this.y * DEG2RAD;
  const roll = this.x * DEG2RAD;
  // Abbreviations for the various angular functions
  let cy = Math.cos(yaw * 0.5);
  let sy = Math.sin(yaw * 0.5);
  let cp = Math.cos(pitch * 0.5);
  let sp = Math.sin(pitch * 0.5);
  let cr = Math.cos(roll * 0.5);
  let sr = Math.sin(roll * 0.5);

  const q = new Quaternion();
  q.w = cr * cp * cy + sr * sp * sy;
  q.x = sr * cp * cy - cr * sp * sy;
  q.y = cr * sp * cy + sr * cp * sy;
  q.z = cr * cp * sy - sr * sp * cy;
  return q;
};
/** @returns { String } String */
EulerAngle.prototype.toString = function () {
  return `EulerAngle: [${this.x}, ${this.y}, ${this.z}]`;
};

/**
 * @class Quaternion
 * @constructor
 *
 * @param { Array | Quaternion | Number= } w w component in RADIANTS
 * @param { Number= } x x component in RADIANTS
 * @param { Number= } y y component in RADIANTS
 * @param { Number= } z z component in RADIANTS
 *
 * @version 1.0
 * @author Tomas Pietravallo
 */
export const Quaternion = function Quaternion(w, x, y, z) {
  if (w instanceof Array) {
    this.w = w[0];
    this.x = w[1];
    this.y = w[2];
    this.x = w[3];
  } else if (w instanceof EulerAngle) {
    return w.toQuaternion();
  } else {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
};
Quaternion.prototype.add = function add(x) {
  if (x instanceof Quaternion) {
    this.w += x.w || 0;
    this.x += x.x || 0;
    this.y += x.y || 0;
    this.z += x.z || 0;
  } else if (x instanceof EulerAngle) {
    return this.add(x.toQuaternion());
  } else if (x instanceof Array) {
    this.w += x[0] || 0;
    this.x += x[1] || 0;
    this.y += x[2] || 0;
    this.z += x[3] || 0;
  } else if (typeof x == 'number') {
    this.w += x || 0;
    this.x += x || 0;
    this.y += x || 0;
    this.z += x || 0;
  }
  return this;
};
Quaternion.prototype.sub = function sub(x) {
  if (x instanceof Quaternion) {
    this.w -= x.w || 0;
    this.x -= x.x || 0;
    this.y -= x.y || 0;
    this.z -= x.z || 0;
  } else if (x instanceof EulerAngle) {
    return this.add(x.toQuaternion());
  } else if (x instanceof Array) {
    this.w -= x[0] || 0;
    this.x -= x[1] || 0;
    this.y -= x[2] || 0;
    this.z -= x[3] || 0;
  } else if (typeof x == 'number') {
    this.w -= x || 0;
    this.x -= x || 0;
    this.y -= x || 0;
    this.z -= x || 0;
  }
  return this;
};
Quaternion.prototype.mul = function mul(x) {
  let w2, x2, y2, z2;
  if (x instanceof Quaternion) {
    w2 = x.w;
    x2 = x.x;
    y2 = x.y;
    z2 = x.z;
  } else if (x instanceof EulerAngle) {
    const q = this.add(x.toQuaternion());
    w2 = q.w;
    x2 = q.x;
    y2 = q.y;
    z2 = q.z;
  } else if (x instanceof Array) {
    w2 = x[0] || 0;
    x2 = x[1] || 0;
    y2 = x[2] || 0;
    z2 = x[3] || 0;
  } else if (typeof x == 'number') {
    w2 = x || 0;
    x2 = x || 0;
    y2 = x || 0;
    z2 = x || 0;
  }
  var w1 = this.w;
  var x1 = this.x;
  var y1 = this.y;
  var z1 = this.z;

  this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
  this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
  this.y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2;
  this.z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2;

  return this;
};
Quaternion.prototype.div = function (x) {
  let [w1, x1, y1, z1] = [this.w, this.x, this.y, this.z];
  let w2, x2, y2, z2;
  if (x instanceof Quaternion) {
    if (
      Number.isFinite(x.w) &&
      Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.w === 'number' &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
    ) {
      if (x.w === 0 || x.x === 0 || x.y === 0 || x.z === 0) {
        Diagnostics.log('Quaternion.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'Quaternion.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    w2 = x.w;
    x2 = x.x;
    y2 = x.y;
    z2 = x.z;
  } else if (x instanceof Array) {
    if (
      x.every((value) => Number.isFinite(value)) &&
      x.every((value) => typeof value === 'number')
    ) {
      if (x[0] === 0 || x[1] === 0 || x[2] === 0 || x[3] === 0) {
        Diagnostics.log('Quaternion.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'Quaternion.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    w2 = x[0];
    x2 = x[1];
    y2 = x[2];
    z2 = x[3];
  } else if (typeof x == 'number') {
    if (Number.isFinite(x) && typeof x == 'number') {
      if (x === 0) {
        Diagnostics.log('Quaternion.div() aborted. Error: divide by 0');
        return this;
      }
      w2 = x;
      x2 = x;
      y2 = x;
      z2 = x;
    } else {
      Diagnostics.log(
        'Quaternion.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
  }
  let normSq = w2 * w2 + x2 * x2 + y2 * y2 + z2 * z2;
  if (normSq === 0) {
    return new Quaternion(0, 0, 0, 0);
  }
  normSq = 1 / normSq;
  return new Quaternion(
    (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2) * normSq,
    (x1 * w2 - w1 * x2 - y1 * z2 + z1 * y2) * normSq,
    (y1 * w2 - w1 * y2 - z1 * x2 + x1 * z2) * normSq,
    (z1 * w2 - w1 * z2 - x1 * y2 + y1 * x2) * normSq
  );
};
Quaternion.prototype.toEulerAngles = function toEulerAngles() {
  const angles = new EulerAngle();
  // roll (x-axis rotation)
  let sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
  let cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
  angles.x = Math.atan2(sinr_cosp, cosr_cosp) * RAD2DEG;
  // pitch (y-axis rotation)
  let sinp = 2 * (this.w * this.y - this.z * this.x) * RAD2DEG;
  if (Math.abs(sinp) >= 1) {
    angles.y = (PI / 2) * Math.sign(sinp) * RAD2DEG; // use 90 degrees if out of range
  } else {
    angles.y = Math.asin(sinp) * RAD2DEG;
  }
  // yaw (z-axis rotation)
  let siny_cosp = 2 * (this.w * this.z + this.x * this.y);
  let cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
  angles.z = Math.atan2(siny_cosp, cosy_cosp);
  return angles;
};
Quaternion.prototype.toString = function () {
  return `Quaternion: [${this.w}, ${this.x}, ${this.y}, ${this.z}]`;
};

/**
 * @class Vector
 * @requires Diagnostics
 * @constructor
 *
 * @param { Number= } x
 * @param { Number= } y
 * @param { Number= } z
 *
 * @version 1.0
 * @author Tomas Pietravallo
 */
export const Vector = function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};
/** 3D or 2D Vector operations */
// ------------------------------------------------------------- //
/** @param { Vector | Array.<Number> | Number= } x * @returns { Vector } Vector */
Vector.prototype.add = function (x) {
  if (x instanceof Vector) {
    this.x += x.x || 0;
    this.y += x.y || 0;
    this.z += x.z || 0;
  } else if (x instanceof Array) {
    this.x += x[0] || 0;
    this.y += x[1] || 0;
    this.z += x[2] || 0;
  } else if (typeof x == 'number') {
    this.x += x || 0;
    this.y += x || 0;
    this.z += x || 0;
  }
  return this;
};
/** @param { Vector | Array.<Number> | Number= } x * @returns { Vector } Vector */
Vector.prototype.sub = function (x) {
  if (x instanceof Vector) {
    this.x -= x.x || 0;
    this.y -= x.y || 0;
    this.z -= x.z || 0;
  } else if (x instanceof Array) {
    this.x -= x[0] || 0;
    this.y -= x[1] || 0;
    this.z -= x[2] || 0;
  } else if (typeof x == 'number') {
    this.x -= x || 0;
    this.y -= x || 0;
    this.z -= x || 0;
  }
  return this;
};
/** @param { Vector | Array.<Number> | Number= } x * @returns { Vector } Vector */
Vector.prototype.mul = function (x = 1) {
  if (x instanceof Vector) {
    this.x *= x.x;
    this.y *= x.y;
    this.z *= x.z;
  } else if (x instanceof Array) {
    this.x *= x[0];
    this.y *= x[1];
    this.z *= x[2];
  } else if (typeof x === 'number') {
    this.x *= x;
    this.y *= x;
    this.z *= x;
  }
  return this;
};
/** @param { Vector | Array.<Number> | Number } x * @returns { Vector } Vector */
Vector.prototype.div = function (x) {
  if (x instanceof Vector) {
    if (
      Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
    ) {
      if (x.x === 0 || x.y === 0 || x.z === 0) {
        Diagnostics.log('Vector.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'Vector.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    this.x /= x.x;
    this.y /= x.y;
    this.z /= x.z;
    return this;
  } else if (x instanceof Array) {
    if (
      x.every((value) => Number.isFinite(value)) &&
      x.every((value) => typeof value === 'number')
    ) {
      if (x[0] === 0 || x[1] === 0 || x[2] === 0) {
        Diagnostics.log('Vector.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'Vector.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
    this.x /= x[0];
    this.y /= x[1];
    this.z /= x[2];
  } else if (typeof x == 'number') {
    if (Number.isFinite(x) && typeof x == 'number') {
      if (x === 0) {
        Diagnostics.log('Vector.div() aborted. Error: divide by 0');
        return this;
      }
    } else {
      Diagnostics.log(
        'Vector.div() aborted. Error: values are either undefined or not finite'
      );
      return this;
    }
  }
};
/** @returns { Number } Number */
Vector.prototype.magSq = function magSq() {
  return this.x * this.x + this.y * this.y + this.z * this.z;
};
/** @returns { Number } Number */
Vector.prototype.mag = function () {
  return Math.sqrt(this.magSq());
};
/** @param { Vector | Array.<Number> | Number } x * @param { Number= } y * @param { Number= } z * @returns { Number } Number */
Vector.prototype.dot = function dot(x, y, z) {
  if (x instanceof Vector) {
    return this.dot(x.x, x.y, x.z);
  } else if (x instanceof Array) {
    return this.dot(x[0], x[1], x[2]);
  } else if (!(typeof y === 'number') && typeof x === 'number') {
    return this.dot(x, x, x);
  }
  // @ts-ignore
  return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
};
/** @param { Vector } x * @returns { Number } Number */
Vector.prototype.distance = function distance(x) {
  return x.copy().sub(this).mag();
};
/** @returns { Vector } Vector */
Vector.prototype.normalize = function normalize() {
  const len = this.mag();
  len !== 0 && this.mul(1 / len);
  return this;
};
/** @returns { EulerAngle } Vector */
Vector.prototype.orientation = function orientation() {
  const n = this.copy().normalize();
  return new EulerAngle(n.x, n.y, n.z);
};
/** @param { Vector | Array } v * @returns { Vector } Vector*/
Vector.prototype.cross = function cross(v) {
  if (v instanceof Array) {
    this.cross(new Vector(v[0], v[1], v[2]));
  }
  const x = this.y * v.z - this.z * v.y;
  const y = this.z * v.x - this.x * v.z;
  const z = this.x * v.y - this.y * v.x;
  return new Vector(x, y, z);
};
Vector.prototype.limit = function limit(max) {
  const mSq = this.magSq();
  if (mSq > max * max) {
    this.div(Math.sqrt(mSq)).mul(max);
  }
  return this;
};

// 2D Operations
// "2D Vectors only" doesn't mean it'll throw an error.
// It means the function doesn't make sense in a 3D context.
// A Vector with a non-zero z component will just be evaluated based on its x and y
// ------------------------------------------------------------- //

/** @description 2D Vectors only. Angles in DEGREES*/
Vector.prototype.heading = function heading() {
  const h = Math.atan2(this.y, this.x);
  return h * RAD2DEG;
};
/** @description 2D Vectors only. Angles in DEGREES*/
Vector.prototype.rotate = function rotate(a) {
  let newHeading = this.heading() + a;
  const mag = this.mag();
  this.x = Math.cos(newHeading) * mag;
  this.y = Math.sin(newHeading) * mag;
  return this;
};
/** @description 2D Vectors only. Angles in DEGREES*/
Vector.prototype.angleBetween = function angleBetween(x) {
  const dotmagmag = this.dot(x) / (this.mag() * x.mag());
  let angle;
  angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
  angle = angle * Math.sign(this.cross(x).z || 1);
  return angle;
};
/** @description 2D Vectors only. Angles in DEGREES * @param { Number } angle * @param { Number } length * @returns { Vector } Vector */
Vector.prototype.fromAngle = function fromAngle(angle, length) {
  angle = angle || 0;
  length = length || 1;
  return new Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
};

// Useful functions
// ------------------------------------------------------------- //
/** @returns { Vector } Vector */
Vector.prototype.random2D = function random2D() {
  const v = Vector.prototype.fromAngle(Math.random() * TWO_PI);
  this.x = v.x;
  this.y = v.y;
  this.z = 0;
  return this;
};
/** @returns { Vector } Vector */
Vector.prototype.random3D = function random3D() {
  const angle = Math.random() * TWO_PI;
  const vz = Math.random() * 2 - 1;
  const vzBase = Math.sqrt(1 - vz * vz);
  const vx = vzBase * Math.cos(angle);
  const vy = vzBase * Math.sin(angle);
  this.x = vx;
  this.y = vy;
  this.z = vz;
  return this;
};
/** @returns { Vector } Vector */
Vector.prototype.copy = function (x) {
  return new Vector(this.x, this.y, this.z);
};
/** @param { Vector | Array.<Number> | Number } x * @param { Number= } y * @param { Number= } z * @returns { Boolean } Boolean */
Vector.prototype.equals = function equals(x, y, z) {
  let a, b, c;
  if (x instanceof Vector) {
    a = x.x;
    b = x.y;
    c = x.z;
  } else if (x instanceof Array) {
    a = x[0];
    b = x[1];
    c = x[2];
  } else {
    a = x;
    b = y;
    c = z;
  }
  return this.x === a && this.y === b && this.z === c;
};
/** @returns { Vector } Vector */
Vector.prototype.setMag = function setMag(n) {
  return this.normalize().mul(n);
};
/** @param { Vector | Array | Number } x * @param { Number= } y * @param { Number= } z * @returns { Vector } Number */
Vector.prototype.set = function set(x, y, z) {
  if (x instanceof Vector) {
    return this.set(x.x, x.y, x.z);
  } else if (x instanceof Array) {
    return this.set(x[0], x[1], x[2]);
  } else if (!(typeof y === 'number') && typeof x === 'number') {
    return this.set(x, x, x);
  } else if (!(typeof x === 'number')) {
    Diagnostics.log(
      `Vector.set() aborted. Error: Data type not supported; Data provided: ${x}, ${y}, ${z}`
    );
    return this;
  }
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};
/** @param { Number } min * @param { Number } max * @returns { Vector } Vector */
Vector.prototype.clamp = function clamp(min, max) {
  this.x = Math.max(Math.min(this.x, max), min);
  this.y = Math.max(Math.min(this.y, max), min);
  this.z = Math.max(Math.min(this.z, max), min);
  return this;
};
/** @returns { String } String */
Vector.prototype.toString = function () {
  return `Vector: [${this.x}, ${this.y}, ${this.z}]`;
};

/**
 * @description When working with 2D Vectors, Vectors with non-zero components may result in skewed values or hard to debug errors.
 * For example a magnitude or distance value being wrong. To keep this kind of erros under control, in the development stage you can add ._check2D() to any vector and a warning will pop up if the z component is non-zero. Execution will continue if haltExecution=false.
 * @param { Boolean } haltExecution Default: TRUE. If true the function will throw instead of logging, stopping the execution.
 * @returns { Vector } Vector
 */

// (x) => { if (x.z !== 0) throw new Error(); };

Vector.prototype._check2D = function _check2D(haltExecution = true) {
  const warning = `Warning: Vector with non-zero component. ${this.toString()}`;
  if (this.z !== 0) {
    if (haltExecution) {
      throw Error(warning);
    } else {
      Diagnostics.log(warning);
    }
  }
  return this;
};
/** @description Log the vector. You can add any number of checks inside, just like ._check2D() */
Vector.prototype._log = function log() {
  Diagnostics.log(this.toString());
};

// Static Vector functions
// ------------------------------------------------------------- //
/** @returns { Vector } Vector */
Vector.random2D = function random2D() {
  return Vector.prototype.fromAngle(Math.random() * TWO_PI);
};
/** @returns { Vector } Vector */
Vector.random3D = function random3D() {
  const angle = Math.random() * TWO_PI;
  const vz = Math.random() * 2 - 1;
  const vzBase = Math.sqrt(1 - vz * vz);
  const vx = vzBase * Math.cos(angle);
  const vy = vzBase * Math.sin(angle);
  return new Vector(vx, vy, vz);
};
