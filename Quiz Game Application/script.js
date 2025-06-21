let questions = [];
let currentQuestion = 0;
let score = 0;
let username = "";

const startScreen = document.getElementById("start-screen");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const greetingEl = document.getElementById("greeting");

document.getElementById("start-btn").addEventListener("click", () => {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name to begin.");
    return;
  }

  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  loadQuestions();
});

function loadQuestions() {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    })
    .catch(err => {
      alert("Failed to load questions.");
      console.error(err);
    });
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  if (q.type === "single" || q.type === "multiple") {
    q.options.forEach(option => {
      const div = document.createElement("div");
      div.className = "option";
      const input = document.createElement("input");
      input.type = q.type === "single" ? "radio" : "checkbox";
      input.name = "option";
      input.value = option;
      div.appendChild(input);
      div.append(option);
      optionsEl.appendChild(div);
    });
  } else if (q.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "fillAnswer";
    optionsEl.appendChild(input);
  }
}

function checkAnswer() {
  const q = questions[currentQuestion];

  if (q.type === "single") {
    const selected = document.querySelector('input[name="option"]:checked');
    if (selected && selected.value === q.answer) score++;
  } else if (q.type === "multiple") {
    const selected = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(el => el.value);
    if (arraysEqual(selected.sort(), q.answer.sort())) score++;
  } else if (q.type === "fill") {
    const input = document.getElementById("fillAnswer");
    if (input && input.value.trim().toLowerCase() === q.answer.toLowerCase()) score++;
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

document.getElementById("next-btn").addEventListener("click", () => {
  checkAnswer();
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${questions.length}`;
  if (score === 0) {
  greetingEl.textContent = `Oops, ${username}! Better luck next time.`;
} else {
  greetingEl.textContent = `Well done, ${username}!`;
}

}
