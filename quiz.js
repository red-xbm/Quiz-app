let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans"); 
let countSpan = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-button");
let theResultContainer = document.querySelector(".results");
let countDownElement = document.querySelector('.countdown');
//set options
let currentIndex = 0;
let RightAnswer = 0;
let countDownInterval;

//get ajax request
function getRequestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200)  {
            let questionobject = JSON.parse(this.responseText);
            let qCount = questionobject.length;
            console.log(qCount);

            // create Bullets + set questionn Count
            createBullets(qCount);
            
            // add question data 
            addQuestionData(questionobject[currentIndex], qCount);

            // start time countDown
            countDown(10, qCount); 

            // click on submit button
            submit.onclick = () => {

                // get on submit
                let theRightAnswer = questionobject[currentIndex].right_answer;

                // increase insex
                currentIndex++;

                //check the answer
                checkAnswer(theRightAnswer, qCount);

                // remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // add question data
                addQuestionData(questionobject[currentIndex], qCount);

                // hndle bullets class
                handleBullets();

                // start time countDown
                clearInterval(countDownInterval);
                countDown(10, qCount); 

                // sow Results
                ShowResult(qCount);
            };
        }
    };
    myRequest.open("GET", "html-ques.json", true);
    myRequest.send();
};
getRequestions();

// #6

function createBullets(num) {
    countSpan.innerHTML = num;

    // create spans
    for (let i = 0; i < num; i++) {
        
        //create bullet
        let theBullet = document.createElement("span");

        // check if its first span  
        if (i === 0) {
            theBullet.className = 'on';
        }

        // append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
};

function addQuestionData(obj, count) {

    if (currentIndex < count) {
        
    // create h2 question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj["title"]); 

    // appent text to h2
    questionTitle.appendChild(questionText);
    
    // append h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // create the answer
    for (let i = 0; i < 4; i++) {

        // create main answer div
        let mainDiv = document.createElement("div");

        mainDiv.className = 'answer';

        // create radio input
        let radioInput = document.createElement("input");

        //add type + class + id + data attribute
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer-${i}`;
        radioInput.dataset.answer = obj[`answer-${i}`];

        //create label
        let theLabel = document.createElement("label");

        //add for on label
        theLabel.htmlFor = `answer-${i}`;

        //create label text
        let theLabelText = document.createTextNode(obj[`answer-${i}`]);
    
        //add the text to the label
        theLabel.appendChild(theLabelText);

        //add input + label to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        //append all divs answers area
        answersArea.appendChild(mainDiv);
    };
    }
};

function checkAnswer(rAnswer, count) {
    let answer = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answer.length; i++) {
        if (answer[i].checked) {
            theChoosenAnswer = answer[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        RightAnswer++;

        console.log("Good answer");
    }
};

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {

            span.className = "on";
        }
    });
};

function ShowResult(count) {
    let theResults;

    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submit.remove();
        bullets.remove();

        if (RightAnswer > count / 2 && RightAnswer < count) {
            theResults = `<span class="good">Good</span>, ${RightAnswer} from ${count}. `;
        } else if (RightAnswer === count) {
            theResults = `<span class="perfect">perfect</span>.  All Answer Is good. `;
        } else {
            theResults = `<span class=" bad">So Bad</span> ${RightAnswer} from ${count} ! `; 
        }
        theResultContainer.innerHTML = theResults;
}};

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0) {
                clearInterval(countDownInterval);
                submit.onclick();
                console.log("Game Over");
            }
        }, 1000);
    }
};

