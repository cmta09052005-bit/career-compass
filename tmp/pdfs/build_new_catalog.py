import json, random, hashlib, itertools, math
from pathlib import Path
from xml.sax.saxutils import escape
from collections import Counter
import numpy as np
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf'
OUT.mkdir(parents=True, exist_ok=True)
items = json.loads((ROOT/'data/v2/items.json').read_text(encoding='utf-8'))
courses = json.loads((ROOT/'data/v2/courses-master.json').read_text(encoding='utf-8'))
links = json.loads((ROOT/'data/v2/links.json').read_text(encoding='utf-8'))
labels = {x['id']: x['text'] for k,v in items.items() if isinstance(v,list) for x in v if 'text' in x}
labels.update({o['id']:o['text'] for q in items['interests'] for o in q['options']})
assert len(courses)==85 and len(items['skills'])==15
for c in courses:
    l=links[c['id']]
    assert [len(l[k]) for k in ['interests','skills','certificates','electives']]==[2,2,2,5]
    assert len(set(x[:6] for x in l['interests']))==2
    assert all(x in labels for k in ['interests','skills','certificates','electives'] for x in l[k])
    assert l['coreSubject'] in labels
for change in json.loads((ROOT/'data/v2/applied-changes.json').read_text(encoding='utf-8')):
    assert set(change['added']) <= set(links[change['courseId']]['electives'])
    assert not set(change['removed']) & set(links[change['courseId']]['electives'])

rng=np.random.default_rng(20261026)
im=np.zeros((32,85),dtype=np.int16); sm=np.zeros((15,85),dtype=np.int16)
em=np.zeros((70,85),dtype=np.int16); cm=np.zeros((13,85),dtype=np.int16); km=np.zeros((4,85),dtype=np.int16)
for j,c in enumerate(courses):
    l=links[c['id']]
    for x in l['interests']: im[(int(x[4:6])-1)*4+ord(x[-1])-65,j]=1
    for x in l['skills']: sm[int(x[-2:])-1,j]=1
    for x in l['electives']: em[int(x[-2:])-1,j]=1
    for x in l['certificates']: cm[int(x[-2:])-1,j]=1
    km[int(l['coreSubject'][-2:])-1,j]=1

def bonus(gwa):
    return 6 if gwa>=95 else 5 if gwa>=90 else 4 if gwa>=85 else 3 if gwa>=80 else 2 if gwa>=75 else 0

def score_all(f):
    # Independent scalar verification: no search matrices or tie-break used here.
    selected_i={f'INT-{int(q):02d}-{a}' for q,a in f['interests'].items()}
    certs=set(f['certificates']); es=set(f['new']['electives']); cores=set(f['new']['coreSubjects'])
    result=[]
    for c in courses:
        l=links[c['id']]
        interest=3*len(selected_i & set(l['interests']))
        skill=sum(f['skills'][str(int(s[-2:]))] for s in l['skills'])
        cert=3*len(certs & {labels[x] for x in l['certificates']})
        elective=4*len(es & {labels[x] for x in l['electives']})
        core=3*int(labels[l['coreSubject']] in cores)
        academic=elective+core+(bonus(f['gwa']) if elective or core else 0)
        result.append({'courseId':c['id'],'courseName':c['name'],'total':interest+skill+cert+academic,
                       'breakdown':{'interest':interest,'skill':skill,'certificate':cert,'academic':academic}})
    return sorted(result,key=lambda x:-x['total'])

flows=[]; notes=[]; attempts=[]
for j,c in enumerate(courses):
    l=links[c['id']]; tier=j%6
    low,high=[(95,98.5),(90,94.99),(85,89.99),(80,84.99),(75,79.99),(68,74.99)][tier]
    gwa=round(float(rng.uniform(low,high)),2); b=bonus(gwa)
    preferred_e=0 if j%17==0 else 1+j%3
    preferred_c=0 if j%11==0 else 1+j%2
    target_e=[int(x[-2:])-1 for x in l['electives']]
    target_c=[int(x[-2:])-1 for x in l['certificates']]
    target_k=int(l['coreSubject'][-2:])-1
    found=None
    # Try the preferred variety first; retain a fixed GWA tier in every fallback.
    modes=[(preferred_e,preferred_c), (3,preferred_c), (2,2), (3,2)]
    for mode_no,(ne,nc) in enumerate(dict.fromkeys(modes)):
        n=6000
        ia=rng.integers(0,4,(n,8))
        for x in l['interests']: ia[:,int(x[4:6])-1]=ord(x[-1])-65
        sr=rng.integers(1,4,(n,15),dtype=np.int16)
        sk=[int(x[-2:])-1 for x in l['skills']]
        sr[:,sk]=rng.integers(4,6,(n,2)); sr[np.arange(n),np.array(sk)[np.arange(n)%2]]=5
        eset=list(itertools.combinations(target_e,ne))
        cset=list(itertools.combinations(target_c,nc))
        ei=rng.integers(len(eset),size=n); ci=rng.integers(len(cset),size=n)
        ev=np.zeros((n,70),dtype=np.int16); cv=np.zeros((n,13),dtype=np.int16); kv=np.zeros((n,4),dtype=np.int16)
        for z in range(n):
            ev[z,list(eset[ei[z]])]=1; cv[z,list(cset[ci[z]])]=1
            kv[z,target_k]=1
            # Most students select one core strength; some have two or three.
            extra=int(rng.choice([0,1,2],p=[.65,.28,.07]))
            if extra: kv[z,rng.choice([k for k in range(4) if k!=target_k],extra,replace=False)]=1
        ip=3*im[(np.arange(8)*4)[None,:]+ia].sum(axis=1)
        ep=4*(ev@em); kp=3*(kv@km)
        totals=ip+sr@sm+3*(cv@cm)+ep+kp+b*((ep+kp)>0)
        other=totals.copy(); other[:,j]=-999
        leads=totals[:,j]-other.max(axis=1)
        valid=np.flatnonzero(leads>=3)
        if len(valid):
            # Prefer a modest strict lead and varied non-target skills.
            quality=leads[valid]+np.abs((sr[valid]==1).sum(axis=1)-4)*.08
            z=int(valid[np.argmin(quality)])
            found={'route':'NEW','courseId':c['id'],'courseName':c['name'],'group':c['group'],
                   'basecamp':{'gradeLevel':11 if j%2==0 else 12,'curriculum':'New curriculum - electives'},
                   'interests':{str(q+1):chr(65+int(ia[z,q])) for q in range(8)},
                   'skills':{str(q+1):int(sr[z,q]) for q in range(15)},
                   'certificates':[labels[f'CER-{k+1:02d}'] for k in np.flatnonzero(cv[z])],
                   'gwa':gwa,'gwaTier':items['gwaTiers'][tier]['text'],
                   'new':{'electives':[labels[f'ELE-{k+1:02d}'] for k in np.flatnonzero(ev[z])],
                          'coreSubjects':[labels[f'COR-{k+1:02d}'] for k in np.flatnonzero(kv[z])]},
                   'persona':f'A Grade {11 if j%2==0 else 12} explorer considering {c["name"]}, with focused practical strengths and a GWA of {gwa:.2f}.',
                   'interestLabels':{str(q+1):labels[f'INT-{q+1:02d}-{chr(65+int(ia[z,q]))}'] for q in range(8)},
                   'skillLabels':{str(q+1):items['skills'][q]['text'] for q in range(15)}}
            ranks=score_all(found)
            assert ranks[0]['courseId']==c['id'] and ranks[0]['total']==int(totals[z,j])
            lead=ranks[0]['total']-ranks[1]['total']; assert lead>=3
            runners=[r for r in ranks[1:] if r['total']==ranks[1]['total']]
            found['expected']={'rank1':ranks[0], 'rank1Total':ranks[0]['total'], 'runnerUp':ranks[1],
                               'runnerUpTotal':ranks[1]['total'],'lead':lead,
                               'runnerUpTies':[r['courseId'] for r in runners]}
            if mode_no: notes.append({'courseId':c['id'],'preferredElectives':preferred_e,'preferredCertificates':preferred_c,'usedElectives':ne,'usedCertificates':nc})
            attempts.append({'courseId':c['id'],'batches':mode_no+1,'candidatesEvaluated':(mode_no+1)*n})
            break
    if found is None: raise RuntimeError(f'No valid flow found for {c["id"]}; do not deliver')
    flows.append(found)
    print(c['id'],found['expected']['lead'],flush=True)

seen=set()
for f in flows:
    assert len(f['interests'])==8 and len(f['skills'])==15
    assert 0<=len(f['new']['electives'])<=3 and 1<=len(f['new']['coreSubjects'])<=3 and len(f['certificates'])<=3
    sk={int(x[-2:]) for x in links[f['courseId']]['skills']}
    assert all(4<=f['skills'][str(k)]<=5 for k in sk) and any(f['skills'][str(k)]==5 for k in sk)
    assert all(1<=v<=3 for k,v in f['skills'].items() if int(k) not in sk)
    assert 60<=f['gwa']<=100 and f['gwa']==round(f['gwa'],2)
    key=json.dumps({k:f[k] for k in ['interests','skills','certificates','gwa','new']},sort_keys=True)
    assert key not in seen; seen.add(key)
    r=score_all(f); assert r[0]['courseId']==f['courseId'] and r[0]['total']-r[1]['total']>=3
(OUT/'career-compass-new-flows.json').write_text(json.dumps(flows,ensure_ascii=False,indent=2),encoding='utf-8')
verification={'route':'NEW','date':'2026-10-26','passed':85,'failed':0,'smallestLead':min(f['expected']['lead'] for f in flows),
              'gwaTierCounts':dict(Counter(f['gwaTier'] for f in flows)),
              'electiveCounts':dict(Counter(len(f['new']['electives']) for f in flows)),
              'certificateCounts':dict(Counter(len(f['certificates']) for f in flows)),
              'specialHandling':notes,'search':attempts,
              'sourceSha256':{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['data/v2/items.json','data/v2/links.json','data/v2/courses-master.json','data/v2/applied-changes.json']}}
(ROOT/'tmp/pdfs/new-catalog-verification.json').write_text(json.dumps(verification,indent=2),encoding='utf-8')

fontroot=Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('Text',str(fontroot/'arial.ttf')))
pdfmetrics.registerFont(TTFont('TextBold',str(fontroot/'arialbd.ttf')))
pdfmetrics.registerFontFamily('Text',normal='Text',bold='TextBold',italic='Text',boldItalic='TextBold')
W,H=A4; M=36; WIDTH=W-2*M
pdf=canvas.Canvas(str(OUT/'career-compass-new-test-flow-catalog.pdf'),pagesize=A4)
pdf.setTitle('Career Compass | NEW Route | 85 Verified Test Flows')
pdf.setAuthor('Career Compass - scoring QA catalog')
ink=colors.HexColor('#19382e'); muted=colors.HexColor('#53665e'); accent=colors.HexColor('#e9f0eb')
page=0; min_font=20; flow_pages=[]
def p(text,size=8.5,bold=False,space=2):
    return Paragraph(text,ParagraphStyle('p',fontName='TextBold' if bold else 'Text',fontSize=size,leading=size*1.22,textColor=ink,spaceAfter=space))
def section(text,size): return p(text.upper(),size+1,True,4)
def draw(story,flow=False):
    global page
    page+=1
    pdf.setFillColor(ink); pdf.rect(0,H-13,W,13,fill=1,stroke=0)
    pdf.setFont('TextBold',8); pdf.drawString(M,H-30,'CAREER COMPASS  /  NEW ROUTE  /  QA CATALOG')
    y=H-47
    for a in story:
        _,h=a.wrap(WIDTH,H)
        assert y-h>=32, (page,y,h)
        a.drawOn(pdf,M,y-h); y-=h+getattr(a,'spaceAfter',0)
    pdf.setStrokeColor(colors.HexColor('#ced9d1')); pdf.line(M,29,W-M,29)
    pdf.setFillColor(muted); pdf.setFont('Text',7)
    pdf.drawString(M,18,'26 October 2026 | Test data only | Numeric scores are for QA reviewers')
    pdf.drawRightString(W-M,18,str(page)); pdf.showPage()
    if flow: flow_pages.append(page)
def height(story): return sum(a.wrap(WIDTH,H)[1]+getattr(a,'spaceAfter',0) for a in story)
draw([Spacer(1,90),p('85 verified<br/>student answer flows',30,True,22),p('NEW curriculum route',17,True,14),
      p('Career Compass scoring-system test catalog',12,False,28),
      p('<b>Date:</b> 26 October 2026 (Asia/Manila)',10,False,12),
      p('<b>Purpose:</b> Enter one complete profile per course and check that it becomes the unique Rank 1 recommendation with a strict lead of at least 3 total points.',11,False,18),
      p('85 courses | BUS01 to ART06 | 85 distinct answer sets | Python verification against every course',11,True,18),
      p('This catalog is a test fixture for reviewers. Personas are fictional. Numeric totals and breakdowns are verification aids and must not appear in student-facing results.',10,False,18),
      p('Companion file: career-compass-new-flows.json',9)])
rules=[('How to enter a flow','Use English labels. Basecamp gives grade level and curriculum; Grade 11 automatically uses the NEW route. In Mountains choose one letter per question. Rate all 15 Forest statements. Complete Valley in this order: Electives, Core subjects, GWA, Certificates.'),
('Total and ranking','Score(course) = interest + skill + certificate + academic, with no cap. Ranking uses total, then skill, then interest, then a hash. Every target here leads all other courses by at least 3 total points, so the target never needs a tie-break. Students never see these scores.'),
('Interests and skills','Choose exactly one of A-D for each of 8 interest questions. Each matching link gives +3; every course has two links in different questions. Rate all 15 skills from 1 to 5. A course receives the rating itself for each of its two linked skills.'),
('Certificates','Select 0 to 3 of 13 categories; +3 per linked category. None yet represents an empty selection. Every course has two certificate links, so these fixtures use zero, one or two matching categories.'),
('GWA without rounding','Valid input is 60-100, up to two decimals. Bonuses: 95-100: +6; 90 to under 95: +5; 85 to under 90: +4; 80 to under 85: +3; 75 to under 80: +2; below 75: 0. Each tier has 14 or 15 flows.'),
('NEW academic scoring','Choose 0-3 of 70 elective rows (+4 per match), or Not sure yet / None. Choose 1-3 of four core subjects (+3 if the course\'s one linked core is selected). Add GWA once only when at least one selected elective or core matches. There is no cluster question; electives are not core choices. Maximum academic 21; total 43.'),
('OLD route reference','Not used in these flows. A linked strand gives +4 plus the GWA bonus; Academic GAS has no links. Choose 1-3 of 19 old subjects; +3 per matching subject. Maximum total 38.'),
('Reading the expected result','The breakdown lists interest, skill, certificate and academic points. Runner-up means the highest non-target total. If several courses share that total, the flow lists all co-runners; their order would require the hash, but the target remains strictly ahead.'),
('Realism and source fidelity','Target-linked skills are 4 or 5 with at least one 5; all other ratings mix 1-3. GWA varies across six tiers. Options, statements, categories, electives and core labels come from current repository data, with Appendix A strands and Part 3 elective replacements applied. Blank optional selections are explicitly named.')]
story=[p('Rules and entry guide',19,True,12)]
for title,text in rules: story += [p(title,10,True,3),p(escape(text),9,False,10)]
draw(story)

def flow_story(f,n,size):
    e=f['expected']; b=e['rank1']['breakdown']; runner=e['runnerUp']
    st=[p(f'{n:02d} / 85  |  {f["courseId"]} - {escape(f["courseName"])}',14,True,4),
        p(escape(f['group']),9,True,3),p(escape(f['persona']),size,False,6),
        section('Basecamp',size),p(f'Grade level: Grade {f["basecamp"]["gradeLevel"]} | Curriculum: {escape(f["basecamp"]["curriculum"])}'+(' (automatic for Grade 11)' if f['basecamp']['gradeLevel']==11 else ' (select NEW)'),size,False,6),
        section('Mountains - choose one answer per question',size)]
    for q,a in f['interests'].items(): st.append(p(f'<b>Q{q} - {a}.</b> {escape(f["interestLabels"][q])}',size,False,2))
    st.append(Spacer(1,4)); st.append(section('Forest - rate every statement (1-5)',size))
    for q,r in f['skills'].items(): st.append(p(f'<b>{int(q):02d}. [{r}/5]</b> {escape(f["skillLabels"][q])}',size,False,2))
    st.append(Spacer(1,4)); st.append(section('Valley - complete these four steps in order',size))
    for title,values in [('1. Electives',f['new']['electives'] or ['Not sure yet / None']),('2. Core subjects',f['new']['coreSubjects'])]:
        st.append(p(f'<b>{title}:</b> '+ '; '.join(escape(x) for x in values),size,False,3))
    st.append(p(f'<b>3. GWA:</b> {f["gwa"]:.2f} | Tier: {escape(f["gwaTier"])} | Bonus: +{bonus(f["gwa"])}',size,False,3))
    st.append(p('<b>4. Certificates:</b> '+ '; '.join(escape(x) for x in f['certificates'] or ['None yet']),size,False,6))
    st.append(section('Expected result - reviewer use only',size))
    st.append(p(f'<b>Rank 1: {f["courseId"]} - {escape(f["courseName"])} | Total {e["rank1Total"]}</b><br/>Interest {b["interest"]} + skill {b["skill"]} + certificate {b["certificate"]} + academic {b["academic"]}.',size,False,3))
    ties=e['runnerUpTies']
    names={c['id']:c['name'] for c in courses}
    rs='; '.join(f'{x} - {escape(names[x])}' for x in ties)
    st.append(p(f'<b>Runner-up{"s (tied)" if len(ties)>1 else ""}:</b> {rs} | Total {e["runnerUpTotal"]}. <b>Lead: +{e["lead"]}.</b>',size,False,0))
    return st
for n,f in enumerate(flows,1):
    size=10.0; st=flow_story(f,n,size)
    while height(st)>H-82:
        size-=.15; st=flow_story(f,n,size)
    assert size>=7.3,(f['courseId'],size)
    min_font=min(min_font,size); draw(st,True)

for start in range(0,85,23):
    st=[p('Verification summary',19,True,5),p(f'Flows {start+1}-{min(start+23,85)} of 85 | All targets pass with a strict lead of at least 3.',9,False,12)]
    rows=[[p(t,8,True,0) for t in ['Course','Target total','Runner-up*','Lead','GWA tier']]]
    for f in flows[start:start+23]:
        e=f['expected']
        rows.append([p(f'{f["courseId"]} {escape(f["courseName"])}',8,False,0),p(str(e['rank1Total']),8,False,0),p('/'.join(e['runnerUpTies'])+f' ({e["runnerUpTotal"]})',8,False,0),p('+'+str(e['lead']),8,False,0),p(escape(f['gwaTier']),8,False,0)])
    t=Table(rows,colWidths=[204,48,91,30,WIDTH-373],repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),accent),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,0),.8,muted),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f5f7f5')])]))
    st += [t,Spacer(1,10),p('* Co-runners share the highest non-target score; target lead is unaffected. All IDs resolve to exact names on their own flow pages.',8)]
    draw(st)
st=[p('Method and verification record',19,True,12),
    p('85 / 85 passed. Smallest strict lead: +'+str(verification['smallestLead'])+'. No target uses a ranking tie-break.',12,True,12),
    p('A seeded Python/NumPy candidate search generated profiles using the exact current link tables. Both target interest links were selected. Target-linked skills were restricted to 4-5 with at least one 5, while other ratings were independently mixed across 1-3. Electives and certificates were drawn from target-linked categories, with occasional empty selections. Core choices included the target\'s single linked core. The GWA tier was fixed per target before search and retained through any fallback.',9,False,10),
    p('An independent scalar Python scorer then recomputed interest, skill, certificate and academic points for ALL 85 courses for each of the 85 final profiles (7,225 course evaluations). It checked each target\'s unique Rank 1 and minimum three-point lead, answer limits, linked skill bounds, GWA validity and distinct answer sets. Matrices used during search were not reused for that verification. Appendix replacement postconditions and source link counts were checked before search. This establishes valid witnesses, not maximum possible leads or real-student outcome probabilities.',9,False,10),
    p('GWA tier distribution: '+ '; '.join(f'{k}: {v}' for k,v in verification['gwaTierCounts'].items())+'.',9,False,10),
    p('Certificate counts: '+str(verification['certificateCounts'])+'. Elective counts: '+str(verification['electiveCounts'])+'. Counts map number selected to number of flows.',9,False,10),
    p('Special handling',11,True,5),
    p(('; '.join(f'{x["courseId"]}: preferred {x["preferredElectives"]} elective(s)/{x["preferredCertificates"]} certificate(s), used {x["usedElectives"]}/{x["usedCertificates"]}' for x in notes) or 'None. All courses passed using their first preferred elective/certificate counts.')+'. GWA tiers were never changed to force a pass.',9,False,10),
    p('Source trace',11,True,5)]
for src,digest in verification['sourceSha256'].items(): st += [p(escape(src),8,True,2),p('SHA-256: '+digest,7,False,7)]
st += [p('Exact current labels are transcribed from data/v2/items.json; exact course names and groups from data/v2/courses-master.json. Link data already includes Appendix A strand assignments and Part 3 / Appendix B elective changes. The old-route alternative is documented for context only; this deliverable contains NEW flows.',9,False,10),
       p('JSON conventions: question/statement numbers are the keys requested by the user; exact associated text is retained in interestLabels and skillLabels. Elective, core and certificate selections contain exact display labels. Empty elective/certificate arrays mean Not sure yet / None and None yet respectively. expected includes score breakdowns and all tied runner-up IDs. Runner-up order within a tie is not asserted.',9)]
draw(st)
pdf.save()
reader=PdfReader(OUT/'career-compass-new-test-flow-catalog.pdf')
assert len(reader.pages)==92,len(reader.pages)
for i,f in enumerate(flows):
    text=reader.pages[i+2].extract_text()
    assert f['courseId'] in text and f['courseName'] in text
    assert '15. [' in text and '4. Certificates:' in text and 'Lead:' in text
verification.update({'pdfPages':len(reader.pages),'minimumFlowFontSize':round(min_font,2),'flowPages':flow_pages})
(ROOT/'tmp/pdfs/new-catalog-verification.json').write_text(json.dumps(verification,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in verification.items() if k not in ['search','sourceSha256','flowPages']},indent=2))
