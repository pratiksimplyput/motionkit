"""Create a macOS development installer ZIP without requiring macOS build tools."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
script = r'''#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
printf '\nMotionKit — Mac development installer\n\n'
printf 'This unsigned test build installs a CEP panel and enables unsigned CEP extensions.\n'
printf 'After Effects must be closed. No administrator password is needed.\n\n'
read -r -p 'Continue? [y/N] ' answer
case "$answer" in y|Y|yes|YES) ;; *) exit 0 ;; esac
if pgrep -f '/Adobe After Effects[^/]*/.*After Effects' >/dev/null 2>&1; then
  printf '\nClose After Effects, then run this installer again.\n'
  read -r -p 'Press Return to close.' unused
  exit 1
fi
source_dir="$PWD/com.simplyput.motionkit"
target_dir="$HOME/Library/Application Support/Adobe/CEP/extensions/com.simplyput.motionkit"
if [[ ! -f "$source_dir/CSXS/manifest.xml" ]]; then
  printf '\nMissing panel files. Extract the complete ZIP before running this installer.\n'
  exit 1
fi
mkdir -p "$(dirname "$target_dir")"
if [[ -e "$target_dir" ]]; then
  backup_dir="$HOME/Library/Application Support/MotionKit/Backups/$(date +%Y%m%d-%H%M%S)-$$"
  mkdir -p "$backup_dir"
  mv "$target_dir" "$backup_dir/com.simplyput.motionkit"
  printf '\nPrevious installation preserved in %s\n' "$backup_dir"
fi
cp -R "$source_dir" "$target_dir"
# These development preferences cover CEP 11 and 12; Adobe's actual runtime
# still needs verification on the target AE 26 installation.
for runtime in 11 12; do
  defaults write "com.adobe.CSXS.$runtime" PlayerDebugMode -string 1
done
printf '\nInstalled MotionKit.\nOpen After Effects → Window → Extensions → MotionKit.\n'
printf '\nDevelopment loading enabled for CEP 11 and 12. This preference allows other unsigned CEP panels too.\n'
printf 'To disable after testing (MotionKit will then need signing):\n'
printf 'defaults delete com.adobe.CSXS.11 PlayerDebugMode\n'
printf 'defaults delete com.adobe.CSXS.12 PlayerDebugMode\n'
printf '\nTest: select a rectangle shape layer, apply 24 px, then press Cmd+Z.\n'
read -r -p 'Press Return to finish.' unused
'''
readme = '''MotionKit — macOS / After Effects 26 development build

1. Quit After Effects.
2. Extract this entire ZIP.
3. Open Install MotionKit.command and confirm the installation.
4. Restart AE and open Window > Extensions > MotionKit.

The installer copies the panel into your user CEP extensions folder, preserves
any previous MotionKit installation, and enables unsigned extension loading
for CEP 11 and 12. No administrator password or network download is required.
The actual AE 26 runtime and host behavior are not yet verified.

macOS may block this unsigned script. You can inspect it in a text editor.
If you trust it, try right-click > Open. If still blocked, open Terminal,
type bash followed by a space, drag Install MotionKit.command into Terminal,
and press Return. Do not disable Gatekeeper globally.

This is not a signed/notarized PKG or commercial installer.
To uninstall, remove:
~/Library/Application Support/Adobe/CEP/extensions/com.simplyput.motionkit
To disable unsigned CEP loading after testing, run:
defaults delete com.adobe.CSXS.11 PlayerDebugMode
defaults delete com.adobe.CSXS.12 PlayerDebugMode
These shared preferences may affect other development panels.

Roundness changes only eligible parametric rectangle paths. Animated and
expression-bearing roundness properties are skipped. Test Undo on a duplicate
project before using this alpha build in production work.
'''
out = root / 'dist' / 'MotionKit-Mac-Installer-0.1.0.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    info = ZipInfo('MotionKit/Install MotionKit.command')
    info.create_system = 3
    info.external_attr = 0o100755 << 16
    z.writestr(info, script)
    z.writestr('MotionKit/READ ME.txt', readme)
    for folder in ('CSXS', 'panel', 'host'):
        for file in sorted((root / folder).rglob('*')):
            if file.is_file():
                z.write(file, 'MotionKit/com.simplyput.motionkit/' + str(file.relative_to(root)))
print(out)
