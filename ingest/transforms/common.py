"""Shared model and money-math rules for transforms.

Rounding tolerance
------------------
OMB Historical Tables publish each line independently rounded to the nearest
$1 million, so the sum of components can differ from the published total by a
few million dollars. Validation passes when

    |sum(components) - published_total| <= max($10,000,000, 0.01% of |total|)

Anything outside that is a hard error, not a warning: money math must be
tested, and a bigger gap means we mis-parsed the table.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal

MILLION = Decimal(1_000_000)
ABS_TOLERANCE_USD = Decimal(10_000_000)
REL_TOLERANCE = Decimal("0.0001")  # 0.01%

# Strings OMB uses for "no data" cells.
_MISSING_MARKERS = {"", "N/A", "NA"}


@dataclass(frozen=True)
class SeriesRow:
    """One tidy fiscal_series row (see docs/ARCHITECTURE.md §4.1)."""

    government_level: str  # 'federal'
    metric: str  # 'receipt' | 'outlay'
    category_code: str
    category_name: str
    parent_category_code: str | None
    fiscal_year: int
    amount: Decimal  # nominal USD
    amount_unit: str = "usd_nominal"
    is_projection: bool = False
    notes: str | None = None


@dataclass
class ValidationReport:
    checks: int = 0
    max_delta_usd: Decimal = Decimal(0)
    failures: list[str] = field(default_factory=list)

    def check(self, label: str, total: Decimal, component_sum: Decimal) -> None:
        self.checks += 1
        delta = abs(component_sum - total)
        if delta > self.max_delta_usd:
            self.max_delta_usd = delta
        tolerance = max(ABS_TOLERANCE_USD, (abs(total) * REL_TOLERANCE))
        if delta > tolerance:
            self.failures.append(
                f"{label}: components sum to {component_sum} vs published total "
                f"{total} (delta {delta} > tolerance {tolerance})"
            )

    def raise_if_failed(self) -> None:
        if self.failures:
            raise ValueError(
                f"{len(self.failures)} of {self.checks} sum checks failed:\n"
                + "\n".join(self.failures)
            )


def cell_to_usd(value: object) -> Decimal | None:
    """Convert one spreadsheet cell (millions of USD) to nominal USD.

    Returns None for missing markers: empty cells, 'N/A', and OMB's
    dot-runs ('..........').
    """
    if value is None:
        return None
    if isinstance(value, str):
        text = value.strip()
        if text in _MISSING_MARKERS or set(text) == {"."}:
            return None
        return Decimal(text.replace(",", "")) * MILLION
    if isinstance(value, (int, float)):
        return Decimal(str(value)) * MILLION
    raise TypeError(f"unexpected cell value {value!r}")


def parse_fiscal_year(label: object) -> tuple[int, bool] | None:
    """Parse a fiscal-year label like '1980', 2003, or '2026 estimate'.

    Returns (year, is_projection), or None for non-year labels such as 'TQ'
    (the July-September 1976 transition quarter, which we exclude: it is not a
    fiscal year and would double-count when summed with FY1976/FY1977).
    """
    text = str(label).strip()
    is_projection = "estimate" in text.lower()
    year_part = text.lower().replace("estimate", "").strip()
    if not year_part.isdigit() or len(year_part) != 4:
        return None
    return int(year_part), is_projection
