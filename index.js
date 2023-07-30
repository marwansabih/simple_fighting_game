const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 640,
        y: 112
    },
    imageSrc: './img/shop_anim.png',
    scale: 3,
    frameMax: 6
})

const player = new Fighter({
    position: {
        x: 100,
        y: 320
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "red",
    imageSrc: './img/samuraiMack/idle.png',
    scale: 2.7,
    frameMax: 8,
    offset: {
        x: 215,
        y: 140
    },

    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/idle.png",
            frameMax: 8
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            frameMax: 8
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            frameMax: 2
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            frameMax: 2
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            frameMax: 6
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take hit - white silhouette.png",
            frameMax: 4
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 70
        },
        width: 175,
        height: 50
    }
})


const enemy  = new Fighter({
    position: {
        x: 750,
        y: 320
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 160
    },
    color: "blue",
    imageSrc: './img/kenji/idle.png',
    scale: 2.7,
    frameMax: 4,
    sprites: {
        idle: {
            imageSrc: "./img/kenji/idle.png",
            frameMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            frameMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            frameMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            frameMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            frameMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/Take hit.png",
            frameMax: 3
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -220,
            y: 70
        },
        width: 175,
        height: 50
    }
})

const keys = {
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },
    w : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false  
    },
    ArrowRight : {
        pressed : false
    },
    ArrowUp : {
        pressed : false
    }
}

let lastKey


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    enemy.update()
    player.update()
    player.velocity.x = 0
    if (keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -2
        player.switchSprite('run')
    } else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 2
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }

    if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    enemy.velocity.x = 0
    
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -2
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 2
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite("idle")
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }

    if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // detect collision
    if (
        rectangualCollision({
            rectangle1 : player,
            rectangle2 : enemy
        }) &&
        player.isAttacking &&
        player.frameCurrent <= 4
    ){
        player.isAttacking = false
        enemy.takeHit()
        gsap.to('#enemyHealth', {
            width: enemy.health + "%"
        })
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }


    if (
        rectangualCollision({
            rectangle1 : enemy,
            rectangle2 : player
        }) &&
        enemy.isAttacking && 
        enemy.frameCurrent <= 2
    ){
        enemy.isAttacking = false
        player.takeHit()
        gsap.to('#playerHealth', {
            width: player.health + "%"
        })
    }

    if (player.isAttacking && player.frameCurrent === 2) {
        player.isAttacking = false
    }

    // end game based on health
    if ( enemy.health <= 0 || player.health <= 0){
        displayWinner(timerID)
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'w': 
            player.jump()
            break
        case ' ':
            player.attack()
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp': 
            enemy.jump()
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp': 
            keys.ArrowUp.pressed = false
            break
    }
})
