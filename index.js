const head = document.getElementById("coin-head");
const tail = document.getElementById("coin-tail");
const coinSelection = document.getElementById("coin-selection");


head.addEventListener("click", () => {
  tail.classList.remove("selected");
  head.classList.add("selected");
  coinSelection.textContent = 'Head';
});

tail.addEventListener("click", () => {
  head.classList.remove("selected");
  tail.classList.add("selected");
  coinSelection.textContent = 'Tail';
});
