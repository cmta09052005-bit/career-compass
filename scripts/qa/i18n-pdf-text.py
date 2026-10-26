import json, re, sys
from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
prefix = 'i18n-browser' if '--browser' in sys.argv else 'i18n'
expectations = json.loads((root/'docs'/'qa'/'i18n-pdf-expectations.json').read_text(encoding='utf-8')) if (root/'docs'/'qa'/'i18n-pdf-expectations.json').exists() else None
rows=[]
for route in ('old','new'):
    p=root/'docs'/'qa'/f'{prefix}-{route}.pdf'
    text='\n'.join(page.extract_text() for page in PdfReader(p).pages)
    flat=re.sub(r'\s+',' ',text)
    checks={s: s in text for s in ['Ulat ng Manlalakbay','Profile','Mga Sertipiko','Mga Sagot na Batayan']}
    checks['one_or_two_pages']=1 <= len(PdfReader(p).pages) <= 2
    checks['no_avatar']=all(not page.images for page in PdfReader(p).pages)
    checks['no_removed_sections']=not any(label in flat for label in ['Salary Sources','Your Top Course in Detail','CHED Basis','Pinagkunan ng Suweldo'])
    checks['no_percent']='%' not in text
    checks['no_numeric_scores']=not re.search(r'\b\d+\s*(?:points?|scores?|puntos|iskor)\b',text,re.I)
    checks['no_replacement_glyph']='�' not in text and '\x00' not in text
    if expectations:
        checks['all_sections']=all(s in flat for s in expectations[route]['sections'])
        checks['course_names_preserved']=all(s in flat for s in expectations[route]['names'])
        checks['route_profile_labels']=all(s in flat for s in expectations[route]['profileLabels'])
    if prefix=='i18n-browser' and route=='old':
        checks['accented_name_preserved']='QA Niño Áéíóú Ñü' in flat
    (root/'docs'/'qa'/f'{prefix}-{route}-text.txt').write_text(text,encoding='utf-8')
    doc=pdfium.PdfDocument(p)
    for page in range(len(doc)):
        doc[page].render(scale=1).to_pil().save(root/'docs'/'qa'/f'{prefix}-{route}-page-{page+1}.png')
    rows.append({'route':route,'pages':len(doc),'checks':checks,'pass':all(checks.values())})
probe=PdfReader(root/'docs'/'qa'/'i18n-glyph-probe.pdf').pages[0].extract_text()
glyphs='ñ Ñ á é í ó ú Á É Í Ó Ú ü Ü'
assert probe.count(glyphs)==2,repr(probe)
pdfium.PdfDocument(root/'docs'/'qa'/'i18n-glyph-probe.pdf')[0].render(scale=1).to_pil().save(root/'docs'/'qa'/'i18n-glyph-probe.png')
out={'reports':rows,'glyphProbe':True,'method':'pypdf extraction; bundled PDFium rendering; built-in Helvetica normal and bold, no font assets added.'}
(root/'docs'/'qa'/f'{prefix}-pdf-checks.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False))
sys.exit(0 if all(r['pass'] for r in rows) else 1)
