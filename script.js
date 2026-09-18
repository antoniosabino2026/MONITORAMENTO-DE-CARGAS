const lightStatus = document.getElementById('light-status');
const toggleLightButton = document.getElementById('toggle-light');

let isOn = false;
toggleLightButton.addEventListener('click', () => {
    isOn = !isOn;
    lightStatus.textContent = isOn ? 'Ligada' : 'Desligada';
    toggleLightButton.textContent = isOn ? 'Desligar Luz' : 'Ligar Luz';
});