# Existing assessment icons

DRAFT: all v2 icon assignments require review. No new art or assets.

Mountains previously selected six inline SVGs by C1 to C6: laptop/code, tools, chart, open book, heart/medical cross, palette. Option textures 0 to 3, mountain peaks, summit medallion, selection stamp and celebration dust remain existing CSS/SVG treatments.

Forest StatementIcon contains laptop/code (C1), gear (C2), briefcase (C3), open book (C4), heart/cross (C5), paintbrush (C6), and the Academic-GAS notebook. ForestVine, GrowthSlider stages and fireflies are existing SVG/CSS, preserved.

Valley previously reused StatementIcon for subject cards, the intake strand category and flights. GAS used the notebook. There was no separate ten-strand icon bank. Existing basket drawing, harvest flights, parchment, gauge, pollen and completion celebration remain available.

lib/itemIconsV2.js copies only those existing paths. Neutral default is the existing GAS notebook. data/v2/icon-map.json has 32 option IDs, 15 skill IDs, 10 strand IDs and 13 certificate IDs. Subject, elective and cluster cards use the neutral notebook when no map entry exists.

Neutral assignments requiring review: INT-02-D, INT-03-C, INT-03-D, INT-04-C, INT-05-B, INT-05-C, INT-05-D, INT-06-A, INT-06-B, INT-07-B, INT-07-D, INT-08-A, INT-08-B, INT-08-C, INT-08-D, SKL-05, SKL-07, SKL-08, SKL-10, SKL-11, SKL-12, SKL-13, SKL-14, SKL-15, STR-01, STR-04, STR-06, STR-10, CER-03, CER-04, CER-08, CER-10, CER-11, CER-13.

Legacy data/items.json and scripts/check-strands.mjs are untouched and unused by these three screens.
