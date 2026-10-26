"""Build an unsigned development archive; this is not a signed ZXP installer."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
output = root / 'dist' / 'MotionKit-0.1.0-dev.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for folder in ('CSXS', 'panel', 'host'):
        for path in sorted((root / folder).rglob('*')):
            if path.is_file():
                archive.write(path, Path('com.simplyput.motionkit') / path.relative_to(root))
    archive.write(root / 'docs' / 'INSTALL.md', 'INSTALL.md')
print(output)
