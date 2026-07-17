"""Table 3.2 transform: fixture → expected tidy rows, and money-math checks."""

from decimal import Decimal
from pathlib import Path

import pytest

from transforms.omb_outlays import parse_outlays, validate_outlays

FIXTURES = Path(__file__).parent / "fixtures"
M = Decimal(1_000_000)


@pytest.fixture(scope="module")
def rows():
    return parse_outlays(FIXTURES / "outlays_mini.xlsx")


def by(rows, code, year):
    return next(r for r in rows if r.category_code == code and r.fiscal_year == year)


def test_function_total_rows(rows):
    defense = by(rows, "050", 2000)
    assert defense.amount == 20 * M
    assert defense.category_name == "National Defense"
    assert defense.parent_category_code is None
    assert defense.metric == "outlay"


def test_subfunction_rows_have_function_parent(rows):
    sub = by(rows, "051", 2000)
    assert sub.amount == 17 * M
    assert sub.parent_category_code == "050"
    assert by(rows, "053", 2000).parent_category_code == "050"


def test_uncoded_detail_rows_skipped(rows):
    assert not any(r.category_name == "Military Personnel" for r in rows)


def test_single_subfunction_function_derived(rows):
    medicare = by(rows, "570", 2000)
    assert medicare.amount == 30 * M
    assert medicare.category_name == "Medicare"
    assert medicare.parent_category_code is None
    assert "derived" in (medicare.notes or "")
    # FY1999 Medicare is a dot-run: no rows at all.
    assert not any(
        r.category_code in ("570", "571") and r.fiscal_year == 1999 for r in rows
    )


def test_negative_undistributed_offsetting_receipts(rows):
    assert by(rows, "950", 2000).amount == -4 * M


def test_on_off_budget_rows_skipped(rows):
    # The (On-budget) row after 'Total, Undistributed…' must not clobber
    # anything: there is exactly one 950 function row per year.
    assert len([r for r in rows if r.category_code == "950" and r.fiscal_year == 2000]) == 1


def test_tq_column_excluded_and_estimates_flagged(rows):
    assert {r.fiscal_year for r in rows} == {1999, 2000, 2026}
    assert by(rows, "TOTAL", 2026).is_projection is True
    assert by(rows, "TOTAL", 2000).is_projection is False


def test_grand_total_row(rows):
    assert by(rows, "TOTAL", 2000).amount == 52 * M


def test_function_and_grand_total_sums_within_tolerance(rows):
    report = validate_outlays(rows)
    report.raise_if_failed()
    # 3 checked functions (050, 150, 950 — 570 is derived) × 3 years + 3 grand totals.
    assert report.checks == 12
    assert report.max_delta_usd == 0


def test_bad_function_total_fails_validation():
    rows = parse_outlays(FIXTURES / "outlays_bad_total.xlsx")
    report = validate_outlays(rows)
    with pytest.raises(ValueError, match="function 050 FY2000"):
        report.raise_if_failed()
