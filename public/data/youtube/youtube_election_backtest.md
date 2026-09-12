# YouTube Fixed Early Panel — Election Co-movement Backtest (EXPLORATORY)

**As of:** 2026-09-12  
**Framing:** asymmetric digital engagement / temporal co-movement — **not** vote prediction.


YoY blanked before balanced coverage (usable from **2017→**). 2016 presidential has no reliable fixed-panel YoY under this rule.


## Election feature table

| Year | Type | Left YoY | Right YoY | R−L gap | Faster | Outcome | Hit? | GOP PV margin |
|---|---|---:|---:|---:|---|---|---|---:|
| 2016 | presidential | — | — | — | — | right | — | -2.09 pp |
| 2018 | midterm | 40.0% | 75.7% | 35.7% | right | left | no | — |
| 2020 | presidential | 16.3% | 27.8% | 11.5% | right | left | no | -4.46 pp |
| 2022 | midterm | 14.4% | 14.7% | 0.3% | right | right | yes | — |
| 2024 | presidential | 16.9% | 9.0% | -7.9% | left | right | no | 1.50 pp |

## Summary

- Presidential n = 3
- Directional hit-rate = 0.25 (n=4)
- Corr(R−L YoY, GOP PV margin) = None (n=2) — exploratory; n too small when 2016 YoY blanked

## Limits

- TubeCensus HF download blocked (429); used SocialBlade milestones + Wikipedia + press.
- Many SocialBlade milestones floor at 2016-01-01 — early history truncated.
- Annual series mixes observed and milestone-linear-interpolated values.
- Views largely unavailable historically at panel scale.
- Fixed panel avoids post-2016 survivorship bias but understates later ecosystem.
- n elections tiny → never claim predictive power.
