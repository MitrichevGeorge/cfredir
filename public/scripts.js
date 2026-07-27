const input = document.getElementById('cfInput');
const linkBox = document.getElementById('link');

function parseCF(text) {
    if (!text) return null;
    const match = text.toUpperCase().match(/(\d{3,5})\s*([A-Z])/);
    if (!match) return null;
    return { contest: match[1], problem: match[2] };
}

function updateLink() {
    const parsed = parseCF(input.value);
    if (!parsed) {
        linkBox.innerHTML = '';
        return;
    }

    const url = `https://codeforces.com/contest/${parsed.contest}/problem/${parsed.problem}`;
    linkBox.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
}

function goToProblem() {
    const parsed = parseCF(input.value);
    if (!parsed) return;

    const url = `https://codeforces.com/contest/${parsed.contest}/problem/${parsed.problem}`;
    window.location.href = url;
}

input.addEventListener('input', updateLink);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        goToProblem();
    }
});
