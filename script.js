const START_BTN = document.querySelector("#start-btn")
const CAR = document.querySelector("#car")
const GAME_AREA = document.querySelector("#game-area")
const SCORE_ELEM = document.querySelector("#score")
const SCORE_COVER_RESULT_ELEM = document.querySelector("#score-cover-result")
const SCORE_COVER_ELEM = document.querySelector("#score-cover")
let score = 0
let speed = 1
let level = 0
let step = 4


const createEnemies = () => {
    const startPosition = ["0px", "127px", "254px"]
    for (let i = 0; i <= Math.round(Math.random()); i++) {
        const enemy = document.createElement("img")
        enemy.classList.add("enemy")
        enemy.src = "https://i.ibb.co/FqxyV5B/car.jpg"
        GAME_AREA.append(enemy)
        const index = i === 0 ? Math.round(Math.random() * 2) : Math.round(Math.random())
        enemy.style.left = startPosition.splice( index, 1)
    }
}
const gameOver = () => {
    console.log("game over")
    const enemies = document.querySelectorAll(".enemy")
    enemies.forEach((el) => {
        el.remove()
    })
    clearInterval(intervalId)
    CAR.removeEventListener("keydown", turn)
    SCORE_COVER_RESULT_ELEM.innerText = score
    SCORE_COVER_ELEM.classList.remove("hidden")
}
const animateEnemies = () => {
    const enemies = document.querySelectorAll(".enemy")
    const currentBottomPosition = +getComputedStyle(enemies[0]).bottom.split("px")[0]
    if (currentBottomPosition <= -165) {
        enemies.forEach((el) => {
            score++
            el.remove()
        })
        if (level >= 1) {
            if (speed <= 0.08) {
                step /= 1.2
            }else {
                speed *= 0.8
                console.log("update interval:", 200 * speed, "speed")
                clearInterval(intervalId)
                intervalId = setInterval(animateEnemies, 200 * speed)
                level = 0
            }

        }else {
            level++
        }
        SCORE_ELEM.innerText = score
        createEnemies()
    }else {
        enemies.forEach((el) => {
            if (currentBottomPosition <= 165) {
                const currentLeftPosition = +getComputedStyle(el).left.split("px")[0]
                const currentPosition = +getComputedStyle(CAR).left.split("px")[0]
                if (currentLeftPosition === currentPosition) {
                    gameOver()
                    return
                }
            }
            const currentTopPosition = +getComputedStyle(el).top.split("px")[0]
            el.style.top = `${currentTopPosition + (165 / 4)}px`
        })
    }
}
let intervalId = 0
const startEnemies = () => {
    //create Enemies
    createEnemies()
    //animate Enemies
   intervalId = setInterval(animateEnemies, 200 * speed)
}
const turn = (event) => {
    const enemies = document.querySelectorAll(".enemy")
    console.log(event.keyCode)
    const currentPosition = +getComputedStyle(CAR).left.split("px")[0]
    if (event.keyCode === 37 && currentPosition > 0) {
        CAR.style.left = `${currentPosition - 127}px`
        enemies.forEach((el) => {
            const currentBottomPosition = +getComputedStyle(enemies[0]).bottom.split("px")[0]
            if (currentBottomPosition < 165) {
                const currentLeftPosition = +getComputedStyle(el).left.split("px")[0]
                if (currentPosition === currentLeftPosition) {
                    gameOver()
                }
            }
        })
    }else if (event.keyCode === 39 && currentPosition < 254) {
        CAR.style.left = `${currentPosition + 127}px`
        enemies.forEach((el) => {
            const currentBottomPosition = +getComputedStyle(enemies[0]).bottom.split("px")[0]
            if (currentBottomPosition < 165) {
                const currentLeftPosition = +getComputedStyle(el).left.split("px")[0]
                if (currentPosition === currentLeftPosition) {
                    gameOver()
                }
            }
        })
    }

}
const resetGame = () => {
    score = 0
    speed = 1
    level = 0
    step = 4
    SCORE_ELEM.innerText = score
    SCORE_COVER_ELEM.classList.add("hidden")
}
START_BTN.addEventListener("click", () => {

   const enemies = document.querySelectorAll(".enemy")
   resetGame()
    CAR.addEventListener("keydown", turn)
    CAR.focus()
    startEnemies()
})