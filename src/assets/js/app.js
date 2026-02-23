const personaButtons = document.querySelectorAll('[data-persona-btn]');
const personaResults = document.querySelectorAll('[data-persona-result]');

personaButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const persona = button.getAttribute('data-persona-btn');
    personaButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    personaResults.forEach((panel) => {
      if (panel.getAttribute('data-persona-result') === persona) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  });
});

const toolButtons = document.querySelectorAll('[data-tool-submit]');

toolButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tool = button.getAttribute('data-tool-submit');
    if (tool === 'rent') {
      const income = Number(document.querySelector('[data-tool-input="rent-income"]').value || 0);
      const warm = Number(document.querySelector('[data-tool-input="rent-warm"]').value || 0);
      const ratio = income > 0 ? Math.round((warm / income) * 100) : 0;
      const output = document.querySelector('[data-tool-output="rent"]');
      if (!income || !warm) {
        output.textContent = 'Enter income and rent to see your ratio.';
        return;
      }
      output.textContent = `Warmmiete is about ${ratio}% of your monthly net income.`;
    }

    if (tool === 'ticket') {
      const single = Number(document.querySelector('[data-tool-input="ticket-single"]').value || 0);
      const trips = Number(document.querySelector('[data-tool-input="ticket-trips"]').value || 0);
      const monthly = single * trips;
      const output = document.querySelector('[data-tool-output="ticket"]');
      if (!single || !trips) {
        output.textContent = 'Enter fare and trips per month to compare.';
        return;
      }
      output.textContent = `Estimated monthly cost: EUR ${monthly.toFixed(2)}. Compare with Deutschlandticket price.`;
    }
  });
});
