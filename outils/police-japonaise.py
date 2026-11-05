"""
Fabrique une version allégée de la police japonaise Dela Gothic One, qui ne contient
QUE les caractères japonais réellement utilisés sur le site.

Pourquoi : le fichier complet pèse ~920 Ko (des milliers de kanji) et ralentissait
fortement le site sur mobile. La version allégée pèse quelques Ko.

Quand le relancer : après avoir ajouté ou modifié du texte japonais dans src/.
    python outils/police-japonaise.py
(nécessite : pip install fonttools brotli)

Un caractère absent de la police allégée s'affiche quand même, avec la police
japonaise du système (repli prévu dans src/styles/global.css).
"""
from pathlib import Path
from fontTools import subset

RACINE = Path(__file__).resolve().parent.parent
SOURCE = RACINE / 'node_modules/@fontsource/dela-gothic-one/files/dela-gothic-one-japanese-400-normal.woff2'
SORTIE = RACINE / 'public/fonts/dela-gothic-one-tsutsu.woff2'

def est_japonais(c: str) -> bool:
    n = ord(c)
    return (0x3000 <= n <= 0x30FF      # ponctuation japonaise, hiragana, katakana
            or 0x3400 <= n <= 0x9FFF   # kanji
            or 0xFF00 <= n <= 0xFFEF)  # formes pleine chasse

caracteres = set()
for f in (RACINE / 'src').rglob('*'):
    if f.suffix in {'.astro', '.ts', '.css', '.md'}:
        caracteres |= {c for c in f.read_text(encoding='utf-8') if est_japonais(c)}

texte = ''.join(sorted(caracteres))
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
options.name_IDs = ['*']
police = subset.load_font(str(SOURCE), options)
s = subset.Subsetter(options)
s.populate(text=texte)
s.subset(police)
SORTIE.parent.mkdir(parents=True, exist_ok=True)
subset.save_font(police, str(SORTIE), options)
print(f'{len(texte)} caractères japonais : {texte}')
print(f'Police allégée : {SORTIE.relative_to(RACINE)} ({SORTIE.stat().st_size // 1024} Ko)')
