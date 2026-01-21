alert("OK");

const input = document.getElementById('cfInput');
const linkBox = document.getElementById('link');

function parseCF(text) {
    const match = text.toUpperCase().match(/(\d{3,5})\s*([A-Z])/);
    if (!match) return null;
    return { contest: match[1], problem: match[2] };
}

input.addEventListener('input', () => {
    const parsed = parseCF(input.value);
    if (!parsed) {
    linkBox.innerHTML = '';
    return;
    }

    const url = `https://codeforces.com/contest/${parsed.contest}/problem/${parsed.problem}`;
    linkBox.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    const parsed = parseCF(input.value);
    if (!parsed) return;

    const url = `https://codeforces.com/contest/${parsed.contest}/problem/${parsed.problem}`;
    window.location.href = url;
    }
});