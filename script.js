// ================= STATE =================

let selectedGrade = null;
let currentGame = null;
let currentQuestionIndex = 0;
let score = 0;

// ================= SOUND =================

function playSound(type) {
    const sounds = {
        correct: "sounds/correct.mp3",
        wrong: "sounds/wrong.mp3",
        win: "sounds/win.mp3"
    };
    if (sounds[type]) {
        new Audio(sounds[type]).play();
    }
}

// ================= SCREEN CONTROL =================

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.style.display = "none";
    });
    document.getElementById(id).style.display = "flex";
}

function goHome() { showScreen("start-screen"); }
function goToLevelSelect() { showScreen("level-screen"); }

// ================= LEVEL SELECT =================

function selectLevel(level) {
    selectedGrade = level;
    document.getElementById("selected-grade-title").innerText =
        "Select a Game - Grade " + level;

    loadGamesForLevel(level);
    showScreen("game-select-screen");
}

// ================= GAME DATABASE =================

const gameDatabase = {

K: [
{
title: "Letter Hunt",
questions: [
{ q:"Tap all the letters 'a': a m s a t r a", options:["3","2","4"], answer:"3" },
{ q:"What is the first letter in 'sun'?", options:["s","u","n"], answer:"s"},
{ q:"Which letter makes the /m/ sound?", options:["m","n","b"], answer:"m"},
{ q:"Drag the correct letter: _at", options:["c","b","d"], answer:"c"},
{ q:"Which word begins like 'ball'?", options:["bat","cat","dog"], answer:"bat"}
]
},
{
title:"Rhyme Time",
questions:[
{q:"Which word rhymes with 'cat'?",options:["hat","hot","cut"],answer:"hat"},
{q:"Which word rhymes with 'sun'?",options:["fun","fan","pen"],answer:"fun"},
{q:"Tap the correct word for 🐶",options:["dog","dig","dug"],answer:"dog"}
]
},
{
title:"Mini Story Time",
questions:[
{q:"The dog runs fast. Who runs?",options:["dog","cat","boy"],answer:"dog"},
{q:"The dog runs fast. How does it run?",options:["slow","fast","sad"],answer:"fast"},
{q:"The cat is on the bed. Where is the cat?",options:["on the bed","under the bed","in the box"],answer:"on the bed"}
]
}
],

1:[
{
title:"Sound Match",
questions:[
{q:"Same beginning sound as 'fish'?",options:["fan","ship","cat"],answer:"fan"},
{q:"c _ p",options:["a","o","u"],answer:"a"},
{q:"Rhymes with 'cake'?",options:["lake","kick","cup"],answer:"lake"},
{q:"Correct spelling?",options:["jumpping","jumping","jumpng"],answer:"jumping"}
]
},
{
title:"Word Builder",
questions:[
{q:"s _ ow",options:["n","m","t"],answer:"n"},
{q:"Correct sentence?",options:["The boy are happy.","The boy is happy.","The boy be happy."],answer:"The boy is happy."},
{q:"Opposite of big?",options:["small","tall","long"],answer:"small"},
{q:"The bird is ___ the tree.",options:["in","on","under"],answer:"in"}
]
},
{
title:"Story Detective",
questions:[
{q:"Tom throws something. What does he throw?",options:["ball","book","hat"],answer:"ball"},
{q:"Who catches the ball?",options:["Ana","Tom","dog"],answer:"Ana"},
{q:"Why does Ana smile?",options:["She caught the ball","She lost the ball","She is tired"],answer:"She caught the ball"},
{q:"What color is the ball?",options:["red","blue","green"],answer:"red"}
]
}
],

2:[
{
title:"Blend Builder",
questions:[
{q:"Which word has a consonant blend?",options:["frog","cat","sun"],answer:"frog"},
{q:"Which word has long vowel?",options:["rain","hat","cap"],answer:"rain"},
{q:"Correct spelling?",options:["flight","flite","fligth"],answer:"flight"},
{q:"b _ _ k",options:["oa","ai","ee"],answer:"oa"}
]
},
{
title:"Word Lab",
questions:[
{q:"Meaning of ancient?",options:["very old","new","small"],answer:"very old"},
{q:"Opposite of happy?",options:["sad","tall","loud"],answer:"sad"},
{q:"The dog ___ loudly.",options:["bark","barks","barking"],answer:"barks"},
{q:"Rhymes with moon?",options:["spoon","sun","man"],answer:"spoon"}
]
},
{
title:"Story Explorer",
questions:[
{q:"Where did Anna go?",options:["park","school","home"],answer:"park"},
{q:"What were ducks doing?",options:["swimming","sleeping","flying"],answer:"swimming"},
{q:"What did she feed them?",options:["bread","rice","corn"],answer:"bread"},
{q:"Why did Anna go?",options:["To sleep","To play","To cry"],answer:"To play"}
]
}
],

3:[
{
title:"Word Detectives",
questions:[
{q:"Word with silent letter?",options:["knee","run","dog"],answer:"knee"},
{q:"Word with vowel team?",options:["boat","cat","hat"],answer:"boat"},
{q:"Correct spelling?",options:["knight","nite","nit"],answer:"knight"},
{q:"pl _ _ ne",options:["ai","ee","oa"],answer:"ai"}
]
},
{
title:"Vocabulary Quest",
questions:[
{q:"Meaning of enormous?",options:["very big","tiny","slow"],answer:"very big"},
{q:"Antonym of ancient?",options:["modern","old","dusty"],answer:"modern"},
{q:"She ___ her homework.",options:["finished","finish","finishing"],answer:"finished"},
{q:"He was ___ to win.",options:["eager","lazy","weak"],answer:"eager"}
]
},
{
title:"Reading Adventure",
questions:[
{q:"How did the rabbit move?",options:["quickly","slowly","sadly"],answer:"quickly"},
{q:"Where did it find carrot?",options:["near the fence","in house","in sky"],answer:"near the fence"},
{q:"Why was rabbit happy?",options:["It ate carrot","It slept","It ran"],answer:"It ate carrot"},
{q:"Main idea?",options:["Rabbit finds and eats carrot","Rabbit is tired","Garden is big"],answer:"Rabbit finds and eats carrot"}
]
}
]

};

// ================= LOAD GAMES =================

function loadGamesForLevel(level){
const grid=document.getElementById("game-grid");
grid.innerHTML="";
gameDatabase[level].forEach((game,i)=>{
const card=document.createElement("div");
card.className="level-card";
card.innerHTML=`<span class="level-icon">🎮</span><span class="level-title">${game.title}</span>`;
card.onclick=()=>startGame(i);
grid.appendChild(card);
});
}

// ================= START GAME =================

function startGame(index){
currentGame=gameDatabase[selectedGrade][index];
currentQuestionIndex=0;
score=0;
showScreen("gameplay-screen");
loadQuestion();
}

// ================= LOAD QUESTION =================

function loadQuestion(){
const container=document.getElementById("game-content");
container.innerHTML="";
const data=currentGame.questions[currentQuestionIndex];

document.getElementById("game-title-display").innerText=currentGame.title;

const q=document.createElement("h3");
q.innerText=data.q;
container.appendChild(q);

const shuffled=[...data.options].sort(()=>Math.random()-0.5);

shuffled.forEach(opt=>{
const btn=document.createElement("button");
btn.className="option-btn";
btn.innerText=opt;
btn.onclick=()=>checkAnswer(opt);
container.appendChild(btn);
});

document.getElementById("feedback").innerText="";
document.getElementById("next-btn").style.display="none";
updateProgress();
}

// ================= CHECK ANSWER =================

function checkAnswer(selected){
const correct=currentGame.questions[currentQuestionIndex].answer;
const buttons=document.querySelectorAll(".option-btn");

buttons.forEach(btn=>{
btn.disabled=true;
if(btn.innerText===correct)btn.style.backgroundColor="#4CAF50";
else if(btn.innerText===selected)btn.style.backgroundColor="#f44336";
});

if(selected===correct){
score++;
playSound("correct");
document.getElementById("feedback").innerText="Correct!";
}else{
playSound("wrong");
document.getElementById("feedback").innerText="Try again!";
}

document.getElementById("next-btn").style.display="inline-block";
}

// ================= NEXT =================

function nextQuestion(){
currentQuestionIndex++;
if(currentQuestionIndex>=currentGame.questions.length){
playSound("win");
showScreen("end-screen");
}else{
loadQuestion();
}
}

function updateProgress(){
const percent=(currentQuestionIndex/currentGame.questions.length)*100;
document.getElementById("progress").style.width=percent+"%";
}