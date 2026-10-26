import json, re, sys
from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
target = root / 'docs' / 'qa' / 'ui-edits'
rows = json.loads((target / 'pdf-expectations.json').read_text(encoding='utf-8'))
results = []
for row in rows:
    name = ('browser-' + ('1' if row['route'] == 'old' else '7') + '-' + row['language']) if '--browser' in sys.argv else row['name']
    path = target / f'{name}.pdf'
    reader = PdfReader(path)
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    flat = re.sub(r'\s+', ' ', text)
    checks = {
        'one_or_two_pages': 1 <= len(reader.pages) <= 2,
        'no_avatar_or_images': all(not page.images for page in reader.pages),
        'no_percent_or_numeric_scores': not re.search(r'%|\b\d+\s*(?:points?|scores?|puntos|iskor)\b', text, re.I),
        'all_five_names': all(course in flat for course in row['courses']),
        'accented_name': 'QA Niño Áéíóú Ñü' in flat,
        'no_broken_glyphs': '\x00' not in text and '�' not in text,
        'profile_before_results': flat.index('Profile' if row['language'] == 'fil' else 'Your Exploration Profile') < flat.index('Mga Kursong Pinakaangkop sa Iyo' if row['language'] == 'fil' else 'Your Top Course Matches'),
        'no_removed_sections': not any(section in text for section in ['Your Top Course in Detail', 'Salary Sources', 'CHED Basis', 'Mga Tip sa Gabay']),
    }
    pdf = pdfium.PdfDocument(path)
    for index in range(len(pdf)):
        pdf[index].render(scale=1.2).to_pil().save(target / f'{name}-{index+1}.png')
    (target / f'{name}.txt').write_text(text, encoding='utf-8')
    results.append({'name': name, 'pages': len(reader.pages), 'checks': checks, 'pass': all(checks.values())})
(target / ('browser-pdf-checks.json' if '--browser' in sys.argv else 'pdf-checks.json')).write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(results, ensure_ascii=False))
sys.exit(0 if all(row['pass'] for row in results) else 1)

