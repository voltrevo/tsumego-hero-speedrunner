async function run() {
  document.documentElement.innerHTML = '';
  document.body.style.margin = '0';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  document.body.append(container);

  const iframeContainer = document.createElement('div');
  const display = document.createElement('div');

  iframeContainer.style.width = '1380px';
  iframeContainer.style.height = '100vh';
  display.style.flexGrow = '1';
  display.style.flexBasis = '0';
  display.style.padding = '1em';

  container.append(iframeContainer);
  container.append(display);

  const state = {
    completed: 0,
    mistakes: 0,
    text: '',
    checkpoints: [],
  };

  let startTime = undefined;

  function renderTime(time, mistakes) {
    time += mistakes * 60000;
    const min = Math.floor(time / 60000);
    const sec = Math.floor((time - 60000 * min) / 1000);

    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  function render() {
    display.innerHTML = '';
    const pre = document.createElement('pre');
    display.append(pre);
    pre.textContent = [
      renderTime(Date.now() - (startTime ?? Date.now()), state.mistakes),
      `completed: ${state.completed}`,
      `mistakes: ${state.mistakes}`,
      ...state.checkpoints.map(
        ([n, t, m]) => `  ${n}: ${renderTime(t, m)} (${m})`,
      ),
    ].join('\n');
  }

  render();

  const startPage = 'https://tsumego-hero.com/tsumegos/play/10207';

  function Iframe() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframeContainer.append(iframe);

    return iframe;
  }

  let activeIframe = Iframe();
  activeIframe.src = startPage;

  while (true) {
    activeIframe.style.display = '';

    let doc = activeIframe.contentDocument;

    state.text = 'detecting load...';
    render();

    await new Promise(resolve => {
      if (doc.querySelector('#status')) {
        resolve();
      } else {
        activeIframe.addEventListener('load', resolve);
      }
    });

    state.text = 'load detected';
    render();

    startTime = startTime ?? Date.now();

    doc = activeIframe.contentDocument;
    const resetBtn = doc.querySelector('.tsumegoNavi-middle').children[1];
    const nextBtn = doc.querySelector('.tsumegoNavi-middle').children[2];

    const bufferIframe = Iframe();
    bufferIframe.src = nextBtn.href;

    resetBtn.addEventListener('click', () => {
      state.mistakes++;
      render();
    });

    state.text = 'detecting completion...';
    render();

    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (doc.querySelector('#status').textContent === 'Correct!') {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(
        doc.querySelector('#status'),
        { attributes: true, childList: true, subtree: true }
      );
    });

    state.text = 'completion detected';
    state.completed++;

    if (state.completed % 50 === 0) {
      state.checkpoints.push([
        state.completed,
        Date.now() - startTime,
        state.mistakes,
      ]);
    }

    render();

    activeIframe.remove();
    activeIframe = bufferIframe;
  }
}
