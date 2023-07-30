function rectangualCollision({
    rectangle1,
    rectangle2
}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function displayWinner(timerID){
    clearTimeout(timerID)
    if( player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = "Tie"
    }
    if( player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = "Player 1 wins"
    }

    if( player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = "Player 2 wins"
    }
    document.querySelector('#displayText').style.display = 'flex'
}

let timer = 60
let timerID
function decreaseTimer()  {
    timerID = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer > 0){
        return
    }
    displayWinner(timerID)
}
