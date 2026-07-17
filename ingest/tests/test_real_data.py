"""Integration checks against the real downloaded OMB files.

Skipped when data/raw has not been populated (run `ntwv-ingest fetch` first).
These prove the documented claim: category sums match published totals within
tolerance for every fiscal year in both tables.
"""

import pytest

from sources.fetch import latest_raw
from transforms.omb_outlays import parse_outlays, validate_outlays
from transforms.omb_receipts import parse_receipts, validate_receipts


def _raw_or_skip(source_id: str):
    raw = latest_raw(source_id)
    if raw is None:
        pytest.skip(f"no raw file for {source_id}; run `ntwv-ingest fetch`")
    return raw


def test_receipts_all_years_reconcile():
    raw = _raw_or_skip("omb_hist_2_1")
    rows = parse_receipts(raw.path)
    report = validate_receipts(rows)
    report.raise_if_failed()
    years = {r.fiscal_year for r in rows}
    assert min(years) == 1934
    assert len(years) >= 90
    assert report.checks == len(years)


def test_outlays_all_years_and_functions_reconcile():
    raw = _raw_or_skip("omb_hist_3_2")
    rows = parse_outlays(raw.path)
    report = validate_outlays(rows)
    report.raise_if_failed()
    years = {r.fiscal_year for r in rows}
    functions = {
        r.category_code
        for r in rows
        if r.parent_category_code is None and r.category_code != "TOTAL"
    }
    assert min(years) == 1962
    # All 20 OMB budget functions, including allowances (920) and
    # undistributed offsetting receipts (950).
    assert len(functions) == 20
    assert report.checks > 1000


def test_no_future_actuals():
    """Validation rule from ARCHITECTURE §6.2: future FYs must be projections."""
    raw = _raw_or_skip("omb_hist_2_1")
    rows = parse_receipts(raw.path)
    latest_actual = max(r.fiscal_year for r in rows if not r.is_projection)
    earliest_projection = min(r.fiscal_year for r in rows if r.is_projection)
    assert latest_actual < earliest_projection
