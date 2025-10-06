document.querySelectorAll('.circle').forEach(circle => {
    const percent = circle.dataset.percent;
    const angle = (percent / 100) * 360;
    circle.style.setProperty('--angle', `${angle}deg`);
    circle.innerHTML = `<span>${percent}%</span>`;
});