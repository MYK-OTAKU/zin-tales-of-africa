## 2024-05-15 - Add ARIA Labels to Icon-only Buttons
**Learning:** Icon-only buttons for favorite and preview in `src/pages/Contes.tsx` lacked ARIA labels, rendering them inaccessible to screen readers. Conditional `aria-label`s based on state (e.g., `isFavorite`) significantly improve a11y.
**Action:** Always check icon-only buttons for `aria-label`s and ensure they dynamically reflect the current state (e.g., "Add to favorites" vs "Remove from favorites").
