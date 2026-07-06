// ======================
// Canvas
// ======================

const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 360;

let running = false;
let mode = "powder"; // powder atau solid

// ======================
// Tombol Menu
// ======================

const powderBtn = document.getElementById("powderBtn");
const solidBtn = document.getElementById("solidBtn");

powderBtn.onclick = function(){

    mode = "powder";

    powderBtn.classList.add("active");
    solidBtn.classList.remove("active");

    document.getElementById("simulationTitle").innerHTML =
    "Powder (Large Surface Area)";

    document.getElementById("statusText").innerHTML =
    "Reaction is Fast";

    document.getElementById("infoText").innerHTML =
    "Powder has a larger surface area, so more particles collide and the reaction occurs faster.";

}

solidBtn.onclick = function(){

    mode = "solid";

    solidBtn.classList.add("active");
    powderBtn.classList.remove("active");

    document.getElementById("simulationTitle").innerHTML =
    "Whole Solid (Small Surface Area)";

    document.getElementById("statusText").innerHTML =
    "Reaction is Slow";

    document.getElementById("infoText").innerHTML =
    "Whole solid has a smaller surface area, so fewer particles collide and the reaction occurs more slowly.";

}

// ======================
// Particle
// ======================

class Particle{

    constructor(){

        this.reset();

    }

    reset(){

        this.x = Math.random()*250+25;
        this.y = Math.random()*250+30;

        this.vx = (Math.random()-0.5)*2.5;
        this.vy = (Math.random()-0.5)*2.5;

        this.r = 6;

        this.color = "gold";

        // khusus mode bongkahan
        this.hit = 0;

    }

    move(){

        this.x += this.vx;
        this.y += this.vy;

        if(this.x<10 || this.x>290)
            this.vx *= -1;

        if(this.y<10 || this.y>350)
            this.vy *= -1;

    }

    draw(){

        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.arc(
            this.x,
            this.y,
            this.r,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

}

// ======================
// Particles
// ======================

const particles=[];

for(let i=0;i<18;i++){

    particles.push(new Particle());

}

// ======================
// Powder
// ======================

let powders=[];

function createPowders(){

    powders=[];

    for(let r=0;r<4;r++){

        for(let c=0;c<4;c++){

            powders.push({

                x:70+c*40,
                y:120+r*35,

                size:18,

                active:true

            });

        }

    }

}

createPowders();

// ======================
// Whole Solid
// ======================

const block={

    x:90,
    y:120,

    width:120,
    height:90

};
// ======================
// Collision Functions
// ======================

function hitPowder(p, powder){

    return(
        powder.active &&
        p.x + p.r > powder.x &&
        p.x - p.r < powder.x + powder.size &&
        p.y + p.r > powder.y &&
        p.y - p.r < powder.y + powder.size
    );

}

function hitBlock(p){

    return(

        p.x + p.r > block.x &&
        p.x - p.r < block.x + block.width &&
        p.y + p.r > block.y &&
        p.y - p.r < block.y + block.height

    );

}

// ======================
// Draw Powder
// ======================

function drawPowder(){

    powders.forEach(powder=>{

        if(powder.active){

            ctx.fillStyle="#4CAF50";

            ctx.fillRect(

                powder.x,
                powder.y,
                powder.size,
                powder.size

            );

        }

    });

}

// ======================
// Draw Whole Solid
// ======================

function drawSolid(){

    ctx.fillStyle="#4CAF50";

    ctx.fillRect(

        block.x,
        block.y,
        block.width,
        block.height

    );

}

// ======================
// Update Particles
// ======================

function updateParticles(){

    particles.forEach(p=>{

        if(running){

            p.move();

            // ===== POWDER =====

            if(mode=="powder"){

                powders.forEach(powder=>{

                    if(

                        p.color=="gold" &&
                        hitPowder(p,powder)

                    ){

                        // Serbuk langsung bereaksi

                        powder.active=false;

                        p.color="limegreen";

                        // Produk berhenti bergerak
                        p.vx=0;
                        p.vy=0;

                    }

                });

            }

            // ===== WHOLE SOLID =====

            else{

                if(

                    p.color=="gold" &&
                    hitBlock(p)

                ){

                    // memantul

                    p.vx*=-1;
                    p.vy*=-1;

                    p.hit++;

                    // harus 4 kali tumbukan baru bereaksi

                    if(p.hit>=4){

                        p.color="limegreen";

                        p.vx=0;
                        p.vy=0;

                        // bongkahan sedikit terkikis
                        block.width-=2;
                        block.height-=2;
                        block.x+=1;
                        block.y+=1;

                    }

                }

            }

        }

        p.draw();

    });

}
// ======================
// Animation
// ======================

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Gambar beaker (garis cairan)
    ctx.strokeStyle="#90CAF9";
    ctx.lineWidth=2;

    ctx.beginPath();
    ctx.moveTo(30,70);
    ctx.lineTo(270,70);
    ctx.stroke();

    // Pilih mode
    if(mode=="powder"){

        drawPowder();

    }else{

        drawSolid();

    }

    // Partikel
    updateParticles();

    // Cek apakah reaksi selesai
    if(mode=="powder"){

        const remain = powders.filter(p=>p.active).length;

        if(remain==0){

            document.getElementById("statusText").innerHTML =
            "✅ Reaction Complete";

        }

    }else{

        if(block.width<=60){

            document.getElementById("statusText").innerHTML =
            "✅ Reaction Complete";

        }

    }

    requestAnimationFrame(animate);

}

animate();

// ======================
// Buttons
// ======================

document.getElementById("startBtn").onclick=function(){

    running=true;

}

document.getElementById("pauseBtn").onclick=function(){

    running=false;

}

document.getElementById("resetBtn").onclick=function(){

    running=false;

    // Reset partikel
    particles.forEach(p=>{

        p.reset();

    });

    // Reset serbuk
    createPowders();

    // Reset bongkahan
    block.x=90;
    block.y=120;
    block.width=120;
    block.height=90;

    // Reset teks
    if(mode=="powder"){

        document.getElementById("statusText").innerHTML =
        "Reaction is Fast";

    }else{

        document.getElementById("statusText").innerHTML =
        "Reaction is Slow";

    }

}
