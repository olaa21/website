// Select the button
const disableAnimationsButton = document.getElementById("disable-animations");

// Add an event listener for toggling animations
disableAnimationsButton.addEventListener("click", () => {
  const htmlElement = document.documentElement; // Select the <html> element

  // Toggle the class
  htmlElement.classList.toggle("disable-animations");

  // Update the button text based on the current state
  if (htmlElement.classList.contains("disable-animations")) {
    disableAnimationsButton.textContent = "Enable Animations";
  } else {
    disableAnimationsButton.textContent = "Disable Animations";
  }
});