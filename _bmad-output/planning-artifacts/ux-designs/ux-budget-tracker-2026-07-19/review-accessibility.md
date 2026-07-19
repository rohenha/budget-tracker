# Accessibility Review — Budget Tracker UX Spine

## Overall Verdict
Base solide (shadcn tokens AA, Base UI focus traps, aria-current specifié) mais manque skip nav, Recharts pas installé, focus dialog non spécifié, heading hierarchy absente.

## Finding Counts

| Severity | Count | Key items |
|----------|-------|-----------|
| 🔴 CRITICAL | 2 | Skip nav link absent ; Recharts pas installé (si v2, charts inaccessibles) |
| 🟠 HIGH | 5 | Dialog focus-return ; heading hierarchy ; hamburger aria-expanded/controls ; DESIGN.md tokens sidebar incomplets ; touch targets non spécifiés |
| 🟡 MEDIUM | 5 | muted-foreground ~3.4:1 (fail AA normal) ; skeleton aria-live absent ; chart dark-mode contrast ; required fields ; reduced motion |
| 🟢 LOW | 3 | wording "décoratives" ; zoom support ; destructive-foreground token absent |
