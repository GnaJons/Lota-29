from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from pypdf import PdfReader
import zipfile
import xml.etree.ElementTree as ET
import json

root = Path(__file__).resolve().parents[1]
pdf_path = root / 'Lota29_myndir_yfirlit.pdf'
canvas = Canvas(str(pdf_path), pagesize=(840, 672), pageCompression=1)
canvas.setTitle('Lota 29 - stílhreinar rúmfræðimyndir')
canvas.setAuthor('Gná Jónsdóttir')
for number in range(1, 6):
    canvas.drawImage(str(root / f'Yfirlit_{number}.png'), 0, 0, width=840, height=672)
    canvas.showPage()
canvas.save()
assert len(PdfReader(pdf_path).pages) == 5

manifest = json.loads((root / 'frumkodi' / 'myndaskra.json').read_text(encoding='utf-8'))
assert len(manifest) == 19
for item in manifest:
    svg = root / 'svg' / (item['name'] + '.svg')
    png = root / 'myndir' / (item['name'] + '.png')
    ET.parse(svg)
    assert png.stat().st_size > 5000

zip_path = root.parent / 'Lota29_stilhreinar_myndir.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for file in sorted(root.rglob('*')):
        if file.is_file():
            z.write(file, file.relative_to(root))
with zipfile.ZipFile(zip_path) as z:
    assert z.testzip() is None
print(json.dumps({'count':len(manifest),'pdf_pages':5,'zip_bytes':zip_path.stat().st_size,'pdf_bytes':pdf_path.stat().st_size},ensure_ascii=False))
