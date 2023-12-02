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
