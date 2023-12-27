let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
const megaGun = document.querySelector('.pulemet');
const standartGun = document.querySelector('.pistolet');
const gunsChoose = document.querySelector('.gun');
const start = document.querySelector('.start');
const gameOver = document.querySelector('.game-over');
const gameWin = document.querySelector('.game-win');
const tryAgain = document.querySelector('.start-game1');
const tryAgain2 = document.querySelector('.start-game2');
const scoreDestroyText = document.querySelector('.score');
const lifesOfShipText = document.querySelector('.scoreA');
let recentresults = document.querySelector('.recent-results');
let bestResults = document.querySelector('.best-results');
const startGame = document.querySelector('.start-game');


let aster = [];
let timer = 0;
let ship = {x:300, y:300};
let fire = [];
let expl = [];

let gun = 1;
let scoreDestroy = 0;
let lifesOfShip = 3;

const sound = new Audio('./img/b.mp3');

let isPlay = false;

let fonImg = new Image();
fonImg.src = './img/fon3.jpg';

let asterImg = new Image();
asterImg.src = './img/astero.png';

let shipImg = new Image();
shipImg.src = './img/spaceship.png';

let fireImg = new Image();
fireImg.src = './img/fire.png';

let explImg = new Image();
explImg.src = './img/expl222.png';

// начать игру по клику в модалке
startGame.addEventListener('click', () => {
    document.querySelector('.modal').style.visibility = 'hidden';
    isPlay = !isPlay;
    if(isPlay === true)
    updateResults();
    game();
})

canvas.addEventListener('mousemove', function(event) {    //замена курсора на корабль и выставление границ
    ship.x = event.offsetX > 560 ? 560 : event.offsetX;
    ship.y = event.offsetY > 510 ? 510 : event.offsetY;
})

gunsChoose.addEventListener('click', (e) => {             // выбор оружия
    if(e.target === standartGun){
        gun = 1;
        megaGun.classList.remove('btn-active');
        standartGun.classList.add('btn-active');
    } 
    if(e.target === megaGun){
        gun = 2;
        standartGun.classList.remove('btn-active');
        megaGun.classList.add('btn-active');
    }
})

explImg.onload = function () {                          //отображение игры тодбко после загрузки файла взрыва
    game();
}

tryAgain.addEventListener('click', ()=>{                //перезагрузка страницы при клике после окончания игры
    location.reload(); 
});

tryAgain2.addEventListener('click', ()=>{               //перезагрузка страницы при клике после окончания игры
    location.reload(); 
});

function game() {                                      //игровой цикл
    if(isPlay){
        update();
        render();
        requestAnimationFrame(game);
    } else {return}
}

function togglePlayPause(){                   //функция поставить на паузу
    isPlay = !isPlay;
    if(isPlay === true){
        start.innerHTML = 'pause';
        start.classList.remove('active-start');
        game();
    } else  {
        start.innerHTML = 'play';
        start.classList.add('active-start');
    }
}

start.addEventListener('click', ()=>{        //пауза на клике по кнопке
    togglePlayPause()
})

document.onkeydown = (e) => {                //пауза на кнопке пробел
    if(e.keyCode === 32) {
        togglePlayPause()
    }
}

// создание оружия 
function fireMega(){
    fire.push({x:ship.x+10, y:ship.y, dx:0, dy:-5.2});
    fire.push({x:ship.x+10, y:ship.y, dx:0.5, dy:-5});
    fire.push({x:ship.x+10, y:ship.y, dx:-0.5, dy:-5});
    fire.push({x:ship.x+10, y:ship.y, dx:1, dy:-5});
    fire.push({x:ship.x+10, y:ship.y, dx:-1, dy:-5});
}

function fireStandart(){
    fire.push({x:ship.x+10, y:ship.y-15, dx:0, dy:-5.2});
}

//Обновление происходящего **************************************************************************
function update() {
    timer++;   //запуск таймера

    function addMoreAsters(){                 //генерация астероидов
        aster.push({
                x:Math.random()*550,
                y:-50,
                dx:Math.random()*2-1, 
                dy:Math.random()*2+2,
                del:0})
    }

    if(timer > 0 && timer < 300){              //добавление астероидов по таймеру 
        if(timer%60=== 0) addMoreAsters()       
    }
    if(timer > 300 && timer < 400){
        if(timer%20=== 0) addMoreAsters()
    }
    if(timer > 400 && timer < 1000){
        if(timer%15=== 0) addMoreAsters()
    }
    if(timer > 1000 && timer < 1300){
        if(timer%10=== 0) addMoreAsters()
    }
    if(timer > 1300 && timer < 1500){
        if(timer%5=== 0) addMoreAsters()
    }
    if(timer > 1500){
        if(timer%50000=== 0) addMoreAsters()
    }
     
    //выпуск пуль, скорость пуль и количество пушек  
    if(timer%20 === 0){
        if(gun === 1) fireStandart();
        if(gun === 2) fireMega();
    }

    //отрисовка взрыва
    for(i in expl) {
        expl[i].animx = expl[i].animx+0.5;
        if(expl[i].animx>7){expl[i].animy++; expl[i].animx = 0}
        if(expl[i].animx>7)
        expl.splice(i,1)
    }

    for(i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;    //полет и направление пули
        fire[i].y = fire[i].y + fire[i].dy;
    
        if(fire[i].y< -30) fire.splice(i,1);   //удаление пули
    }

    for(i in aster) {                              //полет и направление астероида
        aster[i].x = aster[i].x + aster[i].dx;  
        aster[i].y = aster[i].y + aster[i].dy;
    
        if(aster[i].x>=550 || aster[i].x<0) aster[i].dx = -aster[i].dx;  // границы пролета астероида
        if(aster[i].y>=550) {
            lifesOfShip--;          //снижение жизни
            aster.splice(i,1);}    //удаление астероида на нижней границе

        //столкновение астероида с кораблем
        if(Math.abs(aster[i].x + 25 - ship.x - 15)<50 && Math.abs(aster[i].y - ship.y)<25){
            sound.play();
            expl.push({x:aster[i].x-25, y:aster[i].y-25, animx:0, animy:0})  //анимация взрыва
            aster.splice(i,1);
            lifesOfShip--;          //снижение жизни
            break;
        }
        //столкновение астероида с пулей
        for(j in fire) {
            if(Math.abs(aster[i].x + 25 - fire[j].x - 15)<50 && Math.abs(aster[i].y - fire[j].y)<25){
                expl.push({x:aster[i].x-25, y:aster[i].y-25, animx:0, animy:0})  //анимация взрыва
                aster[i].del = 1;
                fire.splice(i,1); 
                scoreDestroy++;  //счетчик метеоритов
                break;
            }
        }
        if(aster[i].del === 1) aster.splice(i,1);  // удаление астероида
    }    
}

//  отрисовка самой игры*****************************************************************************
function render() {
    context.drawImage(fonImg, 0, 0, 600, 600);
    context.drawImage(shipImg, ship.x, ship.y);
    for(i in aster) context.drawImage(asterImg, aster[i].x, aster[i].y, 50, 50);
    for(i in fire) context.drawImage(fireImg, fire[i].x, fire[i].y, 30, 30);
    for(i in expl) context.drawImage(explImg,128*Math.floor(expl[i].animx), 128*Math.floor(expl[i].animy),128,128,expl[i].x, expl[i].y, 100,100);
    scoreDestroyText.innerHTML = scoreDestroy;
    lifesOfShipText.innerHTML = lifesOfShip;
    // function gameEnd(){
    //     cancelAnimationFrame(game);
    //     game = null;
    //     onGameEnd();
    // }
    if(timer > 1650 && lifesOfShip > 0){
        cancelAnimationFrame(game);
        game = null;
        gameWin.style.visibility = 'visible';
        tryAgain.style.visibility = 'visible';
        onGameEnd();
        // gameEnd();
    }
    if(timer > 150 && lifesOfShip === 0){
        cancelAnimationFrame(game);
        game = null;
        gameOver.style.visibility = 'visible';
        tryAgain2.style.visibility = 'visible';
        onGameEnd();
        // gameEnd();
    }
}

// Accordion**********************************************************************
const handleClick = event => {
    const res = document.querySelectorAll(".res")
    const target = event.target.nextElementSibling;
    target.classList.toggle("hide");
    target.classList.toggle("active");
    
    res.forEach(item => {
      if (item !== target) {
        item.classList.add("hide");
        item.classList.remove("active");
      } 
    })
}
  
document.querySelectorAll(".accord").forEach(item => {
    item.addEventListener("click", handleClick)
})

//   локал сторадж********************************************************
function onGameEnd(){
    let inputValue = document.querySelector('.input').value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let bestUsers = JSON.parse(localStorage.getItem("bestUsers")) || [];

    let user = {
        userName: inputValue,
        userScore: scoreDestroy,
    }
    
    if(bestUsers.length < 10){
        bestUsers.push(user);
        bestUsers.sort(function (user1, user2) {
            return user2.userScore - user1.userScore;
        })
    } else {
        if(user.userScore > bestUsers[bestUsers.length - 1]){
            bestUsers.push(user);
            bestUsers.sort(function (user1, user2) {
                return user2.userScore - user1.userScore;
            })
            if(bestUsers > 10)  bestUsers.pop();
        }
    }
    
    localStorage.setItem('bestUsers', JSON.stringify(bestUsers));
    
    if(users.length >= 10) {
        users.shift();
    } 
    users.push(user);

    localStorage.setItem('users', JSON.stringify(users));
    updateResults();
}

// обновление локал сторадж
function updateResults(){
    while (recentresults.firstChild) {
        recentresults.removeChild(recentresults.firstChild);
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    for(let i = 0; i < users.length; i++){
        let user = users[i];
        showScore(user, recentresults);
    }

    while (bestResults.firstChild) {
        bestResults.removeChild(bestResults.firstChild);
    }
    let bestUsers = JSON.parse(localStorage.getItem("bestUsers")) || [];

    for(let i = 0; i < bestUsers.length; i++){
        let bestUser = bestUsers[i];
        showScore(bestUser, bestResults);
    }
}

// вывод результатов в аккордионе
function showScore(user, recentresults) {
    const container10 = document.createElement('div');
    const textScore = document.createElement('div');
    const textName = document.createElement('div');
    container10.classList.add('container10')
    textScore.classList.add('textScore');
    textName.classList.add('textName');
    
    container10.append(textName);
    textName.innerHTML = user.userName;
    container10.append(textScore);
    textScore.innerHTML = user.userScore;
    recentresults.append(container10);
}