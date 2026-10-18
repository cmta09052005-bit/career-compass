# Measured Mountains trail correction

## Result and changed files

`app/journey/page.js` changes only four source lines: ROAD, Mountains, Forest and the saved-position alias lookup. This report is `docs/atlas-mountains-measured.md`. No CSS, artwork, dependencies, assessment, scoring, badges, unlock order, celebrations, walking algorithm, padlock animation or Guide changed.

The 40-point maximum absolute offset falls from **116.09%** to **6.90%** of the local half-width. A separate 1,600-point check of the complete replacement, including the post-Forest join, has maximum **12.27%**. These are measurements relative to the extracted road mask, not a claim that the painting has mathematically exact boundaries.

## Image and coordinate box

The live image is `public/atlas-journey-v3.png`, 1774 × 887 pixels. It fills the map canvas at 100% 100%; the SVG fills the same box with `viewBox="0 0 1000 1000"` and `preserveAspectRatio="none"`. The existing uniform parchment overlay does not change edge locations. Both this image and `atlas-map-v2.webp` retain their previous SHA256 hashes.

## Measurement method and uncertainty

Analysis runs offline on the original pixels; no image-processing dependency is shipped or installed. A broad 70-native-pixel corridor around the existing route selects the correct sandy-road branch between the fixed Basecamp/Forest anchors. It is a topological restriction, not the measured road edge. River branches are outside this corridor or disconnected; the connected sandy component is retained.

The binary mask combines mean-RGB lightness (Gaussian sigma 4 pixels, >178/255), low dark-ink density (fraction of pixels with mean RGB <135, Gaussian sigma 5 pixels, <8.5%), and warm sandy color (blurred red-minus-blue >65). A 7×7 morphological closing fills small texture holes. A seeded connected-component pass discards isolated pale terrain. The mask is frozen before fitting and used unchanged for both tables.

An exact separable Euclidean distance transform gives interior clearance. At ordered transverse stations, the maximum distance-transform value locates the road ridge. The previous route supplies only station ordering and approximate transverse orientation. A small Gaussian smoothing of the ridge removes pixel-scale boundary noise; the saved centerline is independent of the fitted trail. Local half-width is distance-transform clearance at the nearest centerline point. Cubic Hermite spans at roughly 30-native-pixel intervals fit that measured ridge, with tangent constraints at the retained joins.

The painted saddle near (36.8%,39%) and the lower bend near (46.5%,67.5%) have soft watercolor edges. Their boundaries are threshold estimates, rather than hand-traced exact edges. Broad feature thresholds and the connected road topology bridge these faint areas; no river shortcut or manual centerline waypoint is introduced. The overlays expose the chosen boundaries for inspection. Grain and soft ink can shift an extracted edge by a few native pixels.

## Stops and saved positions

- Mountains: (34.91901780963409%, 40.07136903095268%) → (35.009543884317914%, 40.717392281471724%). Nearest-point movement: 5.951 native pixels.
- Forest: (50%, 65%) → (50.03756870392547%, 66.59883517680692%). Nearest-point movement: 14.197 native pixels. The old Forest center was 57.78% of a local half-width from the measured centerline, so retaining it would fail the requested centering criterion.
- Basecamp (8%,52%), Valley (62%,55%) and Islands (88%,63%) are unchanged.

Both moved centers are nearest points on the fitted curve in native-artwork pixel space. The shared REGIONS records drive all node/pin/plate/badge/mark/popover/camera/unlock/walk positions. Recovery accepts Mountains horizontal values `36`, `34.91901780963409` and the new value, and Forest values `50` and the new value. Existing storage keys and formats remain unchanged. Existing pending-walk recovery and arrival writes use the new records; no walking algorithm was modified.

## Old and new path segments

The untouched prefix ends at SVG (164.24000000000004, 429.32), the last retained aligned incoming join. It is the original Basecamp outgoing cubic split at t=0.20. The replacement rejoins the original Forest outgoing cubic at t=0.82, SVG (594.14912, 553.10716). The post-Forest extension is necessary to return smoothly to the existing road-aligned route after moving Forest; the remaining outgoing tail, Valley and all subsequent stretches remain identical. Direction matches at every newly introduced join. The retained subdivided curves match the originals within 0.0000001 SVG units.

Old affected geometry, starting at that incoming join:

```text
C192.4 462.6 186 565 250 565 C275 565 287.5 531.25 301.25 498.75 C315 466.25 340 390 368 390 C430 390 405 675 465 675 C480 675 487.19463086 650.0786937 497.19463086 650.0786937 C498.1171675 650.0786937 499.05220684 650.05265518 500 650 C545.1 650 559.942 572.674 594.14912 553.10716
```

New affected geometry:

```text
C167.63442594 433.33159429 171.77961177 434.04307338 175.20816623 438.17606603 C178.63672069 442.30905868 181.59742415 448.82985183 184.81132677 454.11795589 C188.02522939 459.40605996 191.61520684 464.03587847 194.49158195 469.90469042 C197.36795707 475.77350236 200.23774248 482.09673357 202.06957746 489.33082757 C203.90141245 496.56492156 203.97158897 505.6420434 205.48259185 513.3092544 C206.99359474 520.9764654 208.84797342 528.53827597 211.13559478 535.33409357 C213.42321614 542.12991117 215.41408893 550.85275605 219.20832 554.08416 C223.88885322 558.07039418 227.63084794 565.30138947 232.62894162 568.61771815 C237.6270353 571.93404683 243.71279062 574.20864548 249.19688209 573.9821321 C254.68097355 573.75561872 260.0920176 568.67991362 265.53349042 567.25863788 C270.97496324 565.83736214 276.78046119 568.79112371 281.84571901 565.45447766 C286.91097683 562.11783162 292.0641638 554.87792761 295.92503734 547.23876162 C299.78591088 539.59959563 302.24258807 529.20015932 305.01096026 519.6194817 C307.77933245 510.03880409 310.05893734 499.74699501 312.5352705 489.75469595 C315.01160366 479.76239689 317.15963373 469.39838225 319.86895922 459.66568733 C322.57828471 449.93299241 324.99862227 439.20356883 328.79122344 431.35852642 C332.5838246 423.51348402 337.63457726 417.26876426 342.62456619 412.59543292 C347.61455513 407.92210159 353.2903571 405.29357873 358.73115706 403.31853842 C364.17195702 401.34349811 369.8290206 399.61004042 375.26936595 400.74519107 C380.70971131 401.88034172 386.23834374 405.88070506 391.37322919 410.1294423 C396.50811465 414.37817955 401.39324011 420.20856575 406.07867868 426.23761454 C410.76411725 432.26666334 416.00900421 437.97557722 419.48586062 446.3037351 C422.96271702 454.63189297 425.36356352 465.71554735 426.93981711 476.20656179 C428.51607071 486.69757623 428.32405628 498.1822812 428.9433822 509.24982175 C429.56270812 520.31736229 429.89694672 531.5570953 430.65577263 542.61180503 C431.41459855 553.66651476 431.67219464 565.18197281 433.49633767 575.57808013 C435.3204807 585.97418746 438.68848765 595.45113003 441.60063081 604.98844899 C444.51277397 614.52576794 447.01353534 625.30470471 450.96919661 632.80199385 C454.92485789 640.29928299 460.35830751 645.00221662 465.33459846 649.97218382 C470.31088941 654.94215102 475.46558024 659.93236849 480.82694233 662.62179704 C486.18830441 665.31122559 491.93490408 666.02416045 497.50277096 666.10875513 C498.45968951 666.12329395 499.41742091 666.07841945 500.37568704 665.98835177 C504.99312871 665.55435723 509.6229859 664.07105348 514.23414364 663.12936508 C519.80226339 661.99224637 525.87156029 663.07982627 530.91148948 659.28604283 C535.95141866 655.49225939 540.43374174 647.83176748 544.47371874 640.36666445 C548.51369575 632.90156142 551.35082086 622.66189962 555.15135152 614.49542466 C558.95188217 606.3289497 562.78863803 597.85584042 567.27690266 591.36781471 C571.76516729 584.879789 577.60223639 581.94404617 582.08093927 575.56727039 C586.55964216 569.1904946 588.86595329 556.1291881 594.14912 553.10716
```

Full original and replacement ROAD strings are also saved in `measurement.json` outside the checkout. The trail's exact existing SVG dot size, spacing, color, opacity and layering are unchanged.

## Before: 40 equally spaced arc-length samples

Samples use native 1774×887 image pixels. Each trail is sampled at its own equal arc-length fractions, from the common incoming join to its Forest center. X/Y are map percentages. Offset is signed nearest distance to the same measured centerline: positive is to the right while walking forward in screen/image coordinates (Y increases downward), negative to the left. Percent is signed offset divided by the local half-width ×100.

| Point | Arc % | X % | Y % | Signed offset (px) | Local half-width (px) | Offset / half-width (%) |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0.00 | 16.4240 | 42.9320 | -1.089 | 15.965 | -6.82 |
| 2 | 2.56 | 17.3801 | 44.5660 | +6.960 | 19.997 | +34.80 |
| 3 | 5.13 | 18.1051 | 46.6314 | +12.492 | 21.556 | +57.95 |
| 4 | 7.69 | 18.7273 | 48.8302 | +20.740 | 22.541 | +92.01 |
| 5 | 10.26 | 19.3783 | 50.9948 | +19.713 | 16.981 | +116.09 |
| 6 | 12.82 | 20.1620 | 52.9724 | +11.553 | 19.759 | +58.47 |
| 7 | 15.38 | 21.1335 | 54.5782 | +6.247 | 20.470 | +30.52 |
| 8 | 17.95 | 22.2678 | 55.6776 | -2.277 | 23.668 | -9.62 |
| 9 | 20.51 | 23.4926 | 56.2819 | -5.596 | 25.268 | -22.15 |
| 10 | 23.08 | 24.7506 | 56.4947 | -7.256 | 22.579 | -32.14 |
| 11 | 25.64 | 26.0071 | 56.3002 | -5.106 | 17.690 | -28.86 |
| 12 | 28.21 | 27.1914 | 55.4451 | -11.818 | 20.122 | -58.73 |
| 13 | 30.77 | 28.2268 | 54.0068 | -18.216 | 24.070 | -75.68 |
| 14 | 33.33 | 29.1212 | 52.2247 | -21.577 | 25.589 | -84.32 |
| 15 | 35.90 | 29.9433 | 50.3064 | -14.480 | 24.856 | -58.26 |
| 16 | 38.46 | 30.7416 | 48.3484 | -10.639 | 24.545 | -43.35 |
| 17 | 41.03 | 31.5292 | 46.3728 | -4.931 | 21.930 | -22.49 |
| 18 | 43.59 | 32.3484 | 44.4498 | -0.973 | 22.605 | -4.30 |
| 19 | 46.15 | 33.2267 | 42.6345 | +0.984 | 26.129 | +3.76 |
| 20 | 48.72 | 34.1918 | 41.0066 | -2.567 | 25.464 | -10.08 |
| 21 | 51.28 | 35.2746 | 39.7137 | -7.745 | 23.216 | -33.36 |
| 22 | 53.85 | 36.4852 | 39.0318 | -8.603 | 21.348 | -40.30 |
| 23 | 56.41 | 37.7372 | 39.2438 | -7.896 | 18.952 | -41.66 |
| 24 | 58.97 | 38.8554 | 40.3828 | -3.593 | 18.843 | -19.07 |
| 25 | 61.54 | 39.7102 | 42.2310 | +5.443 | 18.363 | +29.64 |
| 26 | 64.10 | 40.3331 | 44.4254 | +16.083 | 19.722 | +81.55 |
| 27 | 66.67 | 40.8049 | 46.7682 | +27.695 | 25.996 | +106.54 |
| 28 | 69.23 | 41.1858 | 49.1769 | +29.833 | 28.341 | +105.27 |
| 29 | 71.79 | 41.5167 | 51.6153 | +24.568 | 29.976 | +81.96 |
| 30 | 74.36 | 41.8279 | 54.0641 | +21.186 | 29.925 | +70.80 |
| 31 | 76.92 | 42.1460 | 56.5093 | +18.629 | 27.717 | +67.21 |
| 32 | 79.49 | 42.4994 | 58.9349 | +18.936 | 25.217 | +75.09 |
| 33 | 82.05 | 42.9244 | 61.3136 | +22.657 | 23.943 | +94.63 |
| 34 | 84.62 | 43.4747 | 63.5856 | +24.872 | 27.458 | +90.58 |
| 35 | 87.18 | 44.2305 | 65.6019 | +25.639 | 30.398 | +84.34 |
| 36 | 89.74 | 45.2644 | 67.0250 | +25.901 | 29.900 | +86.63 |
| 37 | 92.31 | 46.4966 | 67.5000 | +20.199 | 27.414 | +73.68 |
| 38 | 94.87 | 47.7145 | 66.9176 | +7.157 | 27.917 | +25.64 |
| 39 | 97.44 | 48.7989 | 65.6241 | -7.320 | 26.182 | -27.96 |
| 40 | 100.00 | 50.0000 | 65.0000 | -13.867 | 24.000 | -57.78 |

## After: 40 equally spaced arc-length samples

| Point | Arc % | X % | Y % | Signed offset (px) | Local half-width (px) | Offset / half-width (%) |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0.00 | 16.4240 | 42.9320 | -1.089 | 15.965 | -6.82 |
| 2 | 2.56 | 17.5814 | 43.8937 | +0.016 | 19.979 | +0.08 |
| 3 | 5.13 | 18.5426 | 45.5114 | -0.078 | 21.710 | -0.36 |
| 4 | 7.69 | 19.5094 | 47.1141 | +0.203 | 22.616 | +0.90 |
| 5 | 10.26 | 20.2512 | 49.1271 | -0.042 | 15.820 | -0.27 |
| 6 | 12.82 | 20.5911 | 51.5432 | -0.326 | 19.786 | -1.65 |
| 7 | 15.38 | 21.1852 | 53.7539 | +0.403 | 20.478 | +1.97 |
| 8 | 17.95 | 22.0405 | 55.5188 | -0.056 | 22.537 | -0.25 |
| 9 | 20.51 | 23.1313 | 56.7636 | -0.518 | 25.651 | -2.02 |
| 10 | 23.08 | 24.3516 | 57.3416 | +1.581 | 22.897 | +6.90 |
| 11 | 25.64 | 25.5976 | 57.1812 | +0.420 | 19.187 | +2.19 |
| 12 | 28.21 | 26.8265 | 56.6864 | -0.294 | 19.298 | -1.52 |
| 13 | 30.77 | 28.0796 | 56.6054 | -0.589 | 25.076 | -2.35 |
| 14 | 33.33 | 29.1841 | 55.4375 | +1.142 | 24.954 | +4.58 |
| 15 | 35.90 | 30.0309 | 53.5992 | -1.383 | 25.759 | -5.37 |
| 16 | 38.46 | 30.6527 | 51.4140 | +0.795 | 25.920 | +3.07 |
| 17 | 41.03 | 31.2084 | 49.1587 | +0.243 | 24.394 | +1.00 |
| 18 | 43.59 | 31.7482 | 46.8878 | +0.656 | 22.057 | +2.98 |
| 19 | 46.15 | 32.3387 | 44.6682 | -0.281 | 22.204 | -1.27 |
| 20 | 48.72 | 33.1103 | 42.7021 | +0.174 | 25.897 | +0.67 |
| 21 | 51.28 | 34.1667 | 41.3511 | -0.098 | 25.352 | -0.38 |
| 22 | 53.85 | 35.3541 | 40.5426 | -0.265 | 23.288 | -1.14 |
| 23 | 56.41 | 36.5920 | 40.1094 | +1.081 | 21.148 | +5.11 |
| 24 | 58.97 | 37.8435 | 40.1708 | -0.279 | 18.422 | -1.52 |
| 25 | 61.54 | 39.0396 | 40.9329 | -0.013 | 18.708 | -0.07 |
| 26 | 64.10 | 40.1604 | 42.0660 | +0.166 | 17.955 | +0.93 |
| 27 | 66.67 | 41.2241 | 43.4062 | -0.150 | 22.723 | -0.66 |
| 28 | 69.23 | 42.1311 | 45.1201 | +0.016 | 26.081 | +0.06 |
| 29 | 71.79 | 42.6587 | 47.3937 | -0.118 | 27.453 | -0.43 |
| 30 | 74.36 | 42.8519 | 49.8703 | +0.797 | 29.989 | +2.66 |
| 31 | 76.92 | 42.9647 | 52.3744 | -0.523 | 30.352 | -1.72 |
| 32 | 79.49 | 43.1036 | 54.8733 | +0.330 | 28.145 | +1.17 |
| 33 | 82.05 | 43.3151 | 57.3481 | -0.136 | 26.351 | -0.52 |
| 34 | 84.62 | 43.8757 | 59.5905 | +0.617 | 24.109 | +2.56 |
| 35 | 87.18 | 44.5229 | 61.7458 | +0.409 | 26.200 | +1.56 |
| 36 | 89.74 | 45.3238 | 63.6598 | +0.169 | 29.863 | +0.57 |
| 37 | 92.31 | 46.4197 | 64.8846 | -0.142 | 28.635 | -0.50 |
| 38 | 94.87 | 47.5621 | 65.9318 | -0.313 | 27.541 | -1.14 |
| 39 | 97.44 | 48.7822 | 66.5082 | +0.498 | 26.066 | +1.91 |
| 40 | 100.00 | 50.0376 | 66.5988 | +0.322 | 24.000 | +1.34 |

Maximum absolute signed distance: before 29.833 px; after 1.581 px. Maximum normalized offsets are reported above. The 1,600-point check also covers the continuation beyond Forest to the retained join.

## Evidence files outside the checkout

All files are in `C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-mountains-measured/`:

- `mask.png`: extracted sandy-road mask.
- `before-overlay.png`: whole approach/Mountains/Forest stretch, old dotted line, blue mask edges, magenta measured centerline.
- `after-overlay.png`: same view and edges, corrected dotted line. Both overlays render the original SVG stroke/dashes exactly.
- `before-full-overlay.png`, `after-full-overlay.png`: full artwork versions.
- `measurement.json`: all 80 rows, coordinates, path strings and thresholds.
- `scope-verification.json`: unchanged images/stops, source scope and tangent checks.
- `analyze.py`, `fit.py`: reproducible offline mask/distance/ridge/fit analysis.

## Live verification

- Tested 1920×1080, 1440×900, 1280×720, 1024×768 and 950×700 CSS browser viewports. Mountains-ready and Mountains-done/Forest-ready layouts had no measured overlaps between stop circles, plates/current pin and fixed controls. Both background and trail occupied the same rectangle throughout. Circle-center rounding was under 0.015 CSS px; pin-pointer contact error under 0.008 CSS px. The corrected trail remains inside the measured mask under their common affine scaling.
- The disposable Atlas test profile was restarted and replayed through the actual interface. Closing the first Guide started the Basecamp walk. Reload during that walk recovered, arrived at the new Mountains center, opened the padlock, then cleared the pending state. Reload after arrival and Locate Me did not replay the unlock.
- Completed all eight sample Mountains questions. The existing celebration closed, the button showed Walking to The Forest…, and a mid-walk reload recovered from Mountains. The avatar arrived at the new Forest center, its padlock opened and the existing next-assessment dialog appeared. Reload after arrival and Locate Me retained the new Forest location without replay. Test answers remain only in the local disposable test profile.
- An independent geometry check mirrors the unchanged walking code's 1,001-point endpoint search, 61 keyframes, exact endpoint adjustment and interpolation between keyframes. Within the measured stretch, its maximum normalized offsets are 14.00% for Basecamp→Mountains and 7.31% for Mountains→Forest; both land exactly on their stop coordinates. This complements the browser arrival checks rather than claiming every rendered animation frame was visually sampled.
- Targeted ESLint for the changed dashboard file passed without warnings/errors. `git diff --check` passed. No browser console errors were captured. `npm run dev` was invoked; it briefly announced port 3001, then exited after detecting the existing development server (PID 29788). Browser checks used that running localhost:3000 map.
- Saved-position compatibility checks accept the original Mountains `36`, the first correction's `34.91901780963409`, the final Mountains coordinate, old Forest `50` and the final Forest coordinate. The first-correction Mountains save was also restored live after the new code loaded. Existing pending-walk recovery was exercised in both directions. No new storage flag or storage migration is required.

Additional evidence in the same external folder: `before-offsets.csv`, `after-offsets.csv`, `walk-geometry.json`, `browser-verification.json`, `before-browser.png`, `after-browser-ready.png`, `after-browser-forest.png` and `after-browser-final.png`.

Limits: mask edges are inferred from paint/ink features and remain uncertain by a few native pixels in soft washes. The 25% criterion is evaluated against that documented mask; the blue-edge overlays make the assumption reviewable. Walk interactions were exercised at representative window sizes; the five-size matrix checked layout and common image/SVG scaling. No background edits, manual road-edge tracing, new dependencies or flow changes were needed.
