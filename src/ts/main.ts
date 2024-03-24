// Get the current year and set it to the footer
document.querySelector("#copyright")!.textContent = new Date()
  .getFullYear()
  .toString();

// Light and dark theme functions
const themeToggles = document.querySelectorAll("[data-theme-toggle]");

const getTheme = () => {
  if (typeof localStorage !== "undefined") {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || theme === "light") {
      return theme;
    }
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

//
const setTheme = (theme: string) =>
  document.documentElement.setAttribute("data-theme", theme);

window.addEventListener("DOMContentLoaded", () => setTheme(getTheme()));
// document.addEventListener("astro:after-swap", () => setTheme(getTheme()));

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = getTheme() === "light" ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  });
});

// Password generator logic
document
  .getElementById("password-generator-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const length = Number(formData.get("length"));
    const includeNumbers = Boolean(formData.get("includeNumbers"));
    const includeCapitalLetters = Boolean(
      formData.get("includeCapitalLetters")
    );
    const includeSpecialCharacters = Boolean(
      formData.get("includeSpecialCharacters")
    );

    const password = generatePassword(
      length,
      includeNumbers,
      includeCapitalLetters,
      includeSpecialCharacters
    );
    const passwordDisplay = document.getElementById("password-display");
    if (passwordDisplay) {
      passwordDisplay.textContent = password;
    }
    const copyButton = document.getElementById("copy-button");
    if (copyButton && copyButton.classList.contains("invisible")) {
      copyButton.classList.toggle("invisible");
    }
    const clearButton = document.getElementById("clear-button");
    if (clearButton && clearButton.classList.contains("invisible")) {
      clearButton.classList.toggle("invisible");
    }
  });

// Copy password to clipboard
document.getElementById("copy-button")?.addEventListener("click", function () {
  const passwordDisplay =
    document.getElementById("password-display")?.textContent;
  if (passwordDisplay) {
    navigator.clipboard.writeText(passwordDisplay).then(
      function () {
        alert("Password copied to clipboard!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  }
});

// reset the form to initial state
document.getElementById("clear-button")?.addEventListener("click", () => {
  const form = document.getElementById(
    "password-generator-form"
  ) as HTMLFormElement;
  form.reset();
  hasIncrementButtonBeenClicked = false;

  // Hide the copy button
  const copyButton = document.getElementById("copy-button");
  if (copyButton) {
    copyButton.classList.toggle("invisible");
  }

  // Clear the password display
  const passwordDisplay = document.getElementById("password-display");
  if (passwordDisplay) {
    passwordDisplay.textContent = "";
  }

  // Hide the clear button
  const clearButton = document.getElementById("clear-button");
  if (clearButton) {
    clearButton.classList.toggle("invisible");
  }
});

let hasIncrementButtonBeenClicked = false;

// Increment and decrement password length
document.getElementById("increment-button")?.addEventListener("click", () => {
  const lengthInput = document.getElementById("length") as HTMLInputElement;
  let currentValue = Number(lengthInput.value);
  // If the increment button has not been clicked before, set the initial value to 8
  if (!hasIncrementButtonBeenClicked) {
    currentValue = 7;
    hasIncrementButtonBeenClicked = true;
  }
  if (currentValue < 128) {
    lengthInput.value = String(currentValue + 1);
  }
});

document.getElementById("decrement-button")?.addEventListener("click", () => {
  const lengthInput = document.getElementById("length") as HTMLInputElement;
  const currentValue = Number(lengthInput.value);
  if (currentValue > 8) {
    lengthInput.value = String(currentValue - 1);
  }
});

document.getElementById("length")?.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.value === "") {
    hasIncrementButtonBeenClicked = false;
  }
});

let timeoutId: number | null = null;

const lengthElement = document.getElementById("length");
if (lengthElement) {
  lengthElement.addEventListener("input", function (e) {
    // Clear the previous timeout if there is one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      let value = parseInt((<HTMLInputElement>e.target).value);
      if (value < 8) {
        (<HTMLInputElement>e.target).value = "8";
      } else if (value > 128) {
        (<HTMLInputElement>e.target).value = "128";
      }
    }, 2000); // 2000 milliseconds = 2 seconds
  });
}

function generatePassword(
  length: number,
  includeNumbers: boolean,
  includeCapitalLetters: boolean,
  includeSpecialCharacters: boolean
): string {
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_-+=[]{};:,.<>?";

  let characters = lowerCaseLetters;
  let passwordCharacters: string[] = [];

  if (includeCapitalLetters) {
    characters += upperCaseLetters;
    passwordCharacters.push(
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)]
    );
  }
  if (includeNumbers) {
    characters += numbers;
    passwordCharacters.push(
      numbers[Math.floor(Math.random() * numbers.length)]
    );
  }
  if (includeSpecialCharacters) {
    characters += specialCharacters;
    passwordCharacters.push(
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
    );
  }

  for (let i = passwordCharacters.length; i < length; i++) {
    passwordCharacters.push(
      characters[Math.floor(Math.random() * characters.length)]
    );
  }

  // Shuffle the array to ensure the characters are in a random order
  for (let i = passwordCharacters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordCharacters[i], passwordCharacters[j]] = [
      passwordCharacters[j],
      passwordCharacters[i],
    ];
  }

  const password = passwordCharacters.join("");
  return password;
}
