"""Read-only extraction and score-label checks, using existing bundled pypdf."""
import json, re, sys
from pathlib import Path
from pypdf import PdfReader

required = ["CAREER COMPASS", "Explorer Report", "Your Exploration Profile", "Supporting answers", "Your Top Course Matches", "Careers", "Schools"]
forbidden = re.compile(r"%|\b(?:score|points|rating)\s*[:=]?\s*\d|\b\d+(?:\.\d+)?\s*(?:points|percent)\b", re.I)
rows = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
out=[]
for row in rows:
    try:
        reader=PdfReader(row["path"])
        text=" ".join((page.extract_text() or "") for page in reader.pages)
        normalized=re.sub(r"\s+", " ", text)
        missing=[label for label in required if label not in normalized]
        banned=forbidden.findall(normalized)
        course_present=row["name"] in normalized
        top1_present=("1. " + row["name"]) in normalized
        result={"id":row["id"],"pages":len(reader.pages),"missingSections":missing,"forbiddenLabels":banned,"targetNamePresent":course_present,"top1NamePresent":top1_present,"ok":not missing and not banned and course_present and top1_present and 1 <= len(reader.pages) <= 2 and all(not page.images for page in reader.pages)}
        out.append(result)
    except Exception as error:
        out.append({"id":row["id"],"ok":False,"error":str(error)})
print(json.dumps(out,ensure_ascii=False))
