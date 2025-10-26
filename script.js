document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("surveyForm");
  const sections = document.querySelectorAll(".survey-card");
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (!form || !sections.length || !progressFill || !progressText) {
    console.error("Missing key elements — check HTML IDs.");
    return;
  }

  // ============================
  // 🔹 PROGRESS CALCULATION
  // ============================
  function updateProgress() {
    let completeSections = 0;

    sections.forEach((section) => {
      const questions = section.querySelectorAll(".question");
      let sectionComplete = true;

      questions.forEach((question) => {
        let questionComplete = true;

        // Radio
        const radios = question.querySelectorAll('input[type="radio"]');
        if (radios.length) {
          const checked = Array.from(radios).some((r) => r.checked);
          if (!checked) questionComplete = false;
        }

        // Checkbox
        const checkboxes = question.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length) {
          const checked = Array.from(checkboxes).some((c) => c.checked);
          if (!checked) questionComplete = false;
        }

        // Select
        const select = question.querySelector("select");
        if (select && !select.value) questionComplete = false;

        // Text input
        const textInput = question.querySelector('input[type="text"]');
        if (textInput && !textInput.value.trim()) questionComplete = false;

        if (!questionComplete) sectionComplete = false;
      });

      if (sectionComplete) completeSections++;
    });

    const percent = Math.round((completeSections / sections.length) * 100);
    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "%";
    return percent;
  }

  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  // ============================
  // 🔹 FORM SUBMISSION (fixed for multiple checkboxes)
  // ============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const percent = updateProgress();
    if (percent < 100) {
      alert(`Please complete all sections (Progress: ${percent}%)`);
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    // ✅ Your correct deployed Apps Script URL
    const scriptURL = "https://script.google.com/macros/s/AKfycbxArX4YfUcEUsmzGrab3RNvSeL_naM3I4d1aKBCf4tOGeSUv05Fq6RvRbjj-MD2i6oV/exec";

    try {
      // Collect and process form data to handle multiple checkboxes as comma-separated values
      const processedFormData = new FormData();
      const data = {};

      // Get all form inputs
      const inputs = form.querySelectorAll('input, select, textarea');

      inputs.forEach((input) => {
        const name = input.name;
        if (!name) return; // Skip nameless inputs

        if (input.type === 'radio' || input.type === 'checkbox') {
          if (!input.checked) return; // Only include checked ones
          const value = input.value || 'Yes'; // Default for unnamed value checkboxes
          if (!data[name]) data[name] = [];
          data[name].push(value);
        } else {
          // For text, select, etc.
          data[name] = input.value.trim();
        }
      });

      // Append to FormData: combine checkbox arrays into single comma-separated string
      Object.keys(data).forEach((name) => {
        let val = data[name];
        if (Array.isArray(val)) {
          // Join multiple checkbox values with ", " for easy spreadsheet display
          val = val.join(', ');
        }
        processedFormData.append(name, val);
      });

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // prevents CORS errors
        body: processedFormData,
      });

      alert("✅ Thank you! Your response has been recorded.");
      form.reset();
      updateProgress();
      form.style.display = 'none';  // Hides the form
const footer = document.querySelector('.thank-you-footer');  // Selects the footer element
if (footer) {
  footer.classList.remove('hidden');  // Makes the footer visible
  footer.scrollIntoView({ behavior: 'smooth' });  // Scrolls to the footer smoothly
}
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Network error. Please check your connection.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    }
  });


  
  // Reset form fields on page load
  window.addEventListener("load", () => form.reset());
  updateProgress();

});
