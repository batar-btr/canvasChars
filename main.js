let canvas = document.querySelector('canvas');
let h = canvas.height = innerHeight;
let w = canvas.width = innerWidth;
let ctx = canvas.getContext('2d');

let chars = ['#', '{', '}', '[', ']', '<', '>', '+', '-', ':', ';', '/', '%', '&', '@', '1', '0', '='];

const { PI, sin, cos, random, floor } = Math;

let mousePosition = {
    x: w / 2,
    y: h / 2
}

class Dot {
    constructor(x, y, radius, speed, angle, rotateAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = angle;
        this.rotateAngle;
    }
    update() {
        this.angle += 0.05;
        if (this.angle > PI * 2) {
            this.angle -= PI * 2
        }
    }
    draw() {
        let { x, y, radius, angle, rotateAngle } = this;
        ctx.beginPath();
        ctx.strokeStyle = 'dimgray';
        ctx.arc(this.x, this.y, 50, 0, PI * 2, false);
        ctx.stroke();
        ctx.closePath();

        y = y + sin(angle) * 50;
        x = x + cos(angle) * 50;
        ctx.beginPath();
        ctx.fillStyle = 'dodgerBlue';
        ctx.arc(x, y, radius, 0, PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-this.angle)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText('{', 0, 0);
        ctx.restore();
    }

}

class ParticleDot {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * (Math.PI * 2);
        this.direction = {
            x: cos(this.angle),
            y: sin(this.angle)
        }
        this.speed = 1;
        this.color = 'dodgerBlue';
        this.radius = 10;
        this.char = char;
        this.fromCenter = Math.hypot(x - w / 2, y - h / 2);
        this.opacity = 1;
        this.ttl = 1;
        this.alive = true;
    }
    update() {
        this.x = this.x += this.direction.x * this.speed;
        this.y = this.y += this.direction.y * this.speed;
        this.checkBorderCollision();
        this.angleUpdate();
        this.ttlUpdate();
        // this.checkDistanceFrom(this.x, this.y, w / 2, h / 2);
        // this.updateOpacity();
    }
    draw() {
        // ctx.beginPath();
        // ctx.fillStyle = 'dodgerBlue';
        // ctx.arc(this.x, this.y, this.radius, 0, PI * 2, false);
        // ctx.fill();
        // ctx.closePath();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // ctx.fillStyle = `rgba(30,144,255,${this.opacity})`;
        ctx.fillStyle = `rgba(60,60,60,${this.ttl})`;
        ctx.font = `${this.radius * 2}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
    }
    checkBorderCollision() {
        if (this.x + this.radius >= w || this.x - this.radius <= 0) {
            this.direction.x *= -1;
        }
        if (this.y + this.radius >= h || this.y - this.radius <= 0) {
            this.direction.y *= -1;
        }
        this.x > w - this.radius ? this.x = w - this.radius : this.x;
        this.y > h - this.radius ? this.y = h - this.radius : this.y;
        this.x < this.radius ? this.x = this.radius : this.x;
        this.y < this.radius ? this.y = this.radius : this.y;
    }
    angleUpdate() {
        this.angle += 0.05;
        if (this.angle > PI * 2) {
            this.angle -= PI * 2
        }
    }
    ttlUpdate() {
        this.ttl -= 0.01;
        if (this.ttl <= 0) {
            this.alive = false;
        }
    }
    checkDistanceFrom(x1, y1, x2, y2) {
        this.fromCenter = Math.hypot(x1 - x2, y1 - y2);
    }
    updateOpacity() {
        if (this.fromCenter > 700) {
            this.opacity = 0;
        } else {
            this.opacity = 1 - this.fromCenter / 700;
        }
    }
}
function debounce(f, ms) {

    let isCooldown = false;

    return function () {
        if (isCooldown) return;

        f.apply(this, arguments);

        isCooldown = true;

        setTimeout(() => isCooldown = false, ms);
    };

}

// let dot = new Dot(w / 2, h / 2, 15, 20, random() * (PI * 2), 100);

// let particlesDots = new Array(100).fill('empty').map(() => {
//     let x = floor(random() * w);
//     let y = floor(random() * h);
//     let angle = random() * (PI * 2);
//     let speed = 1;
//     let char = chars[floor(random() * (chars.length - 1))]
//     return new ParticleDot(x, y, angle, speed, char)
// })
// console.log(particlesDots)
let particles = [];

function particlesAliveFilter(arr) {
    return arr.filter(item => item.alive);
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(50,50,50,1)';
    ctx.fillRect(0, 0, w, h);
}
function animate() {
    clearCanvas();
    particles.forEach(dot => {
        dot.update();
        if (dot.alive) dot.draw();
    })
    particles = particlesAliveFilter(particles);
    // dot.draw();
    // dot.update();
    requestAnimationFrame(animate);
}
animate();

function addParticle(x, y, char) {
    particles.push(new ParticleDot(x, y, char));
}
let debounceAddParticle = debounce(addParticle, 100);

canvas.addEventListener('mousemove', e => {
    let { clientX, clientY } = e;
    mousePosition.x = clientX;
    mousePosition.y = clientY;
    debounceAddParticle(clientX, clientY, chars[floor(random() * (chars.length - 1))]);
    console.log(particles)
});

// document.addEventListener('keydown', e => {
//     if (e.code === 'ArrowUp') {
//         particlesDots.forEach(dot => {
//             dot.speed += 1
//         })
//     }
//     if (e.code === 'ArrowDown') {
//         particlesDots.forEach(dot => {
//             dot.speed -= 1;
//             if (dot.speed < 0) dot.speed = 0;
//         })
//     }
// });