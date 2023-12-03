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
document.getElementById("copy-button")?.addEventListener("click", () => {
  const passwordDisplay = document.getElementById("password-display");
  if (passwordDisplay) {
    navigator.clipboard.writeText(passwordDisplay.textContent || "");
  }
});

document.getElementById("clear-button")?.addEventListener("click", () => {
  // reset the form to initial state
  const form = document.getElementById(
    "password-generator-form"
  ) as HTMLFormElement;
  form.reset();

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

// Increment and decrement password length
document.getElementById("increment-button")?.addEventListener("click", () => {
  const lengthInput = document.getElementById("length") as HTMLInputElement;
  const currentValue = Number(lengthInput.value);
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
  if (includeCapitalLetters) {
    characters += upperCaseLetters;
  }
  if (includeNumbers) {
    characters += numbers;
  }
  if (includeSpecialCharacters) {
    characters += specialCharacters;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  console.log(password);
  return password;
}
