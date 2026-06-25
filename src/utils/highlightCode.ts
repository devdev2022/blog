import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);

export function applyCodeHighlight(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('pre > code').forEach((codeEl) => {
    const langClass = Array.from(codeEl.classList).find((c) =>
      c.startsWith('language-'),
    );
    const lang = langClass?.replace('language-', '');
    const text = codeEl.textContent ?? '';

    try {
      const result =
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(text, { language: lang })
          : hljs.highlightAuto(text);
      codeEl.innerHTML = result.value;
      codeEl.classList.add('hljs');
    } catch {
      // 하이라이팅 실패 시 plain text 유지
    }
  });

  return doc.body.innerHTML;
}
