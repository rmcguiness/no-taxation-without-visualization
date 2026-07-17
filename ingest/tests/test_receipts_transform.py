"""Table 2.1 transform: fixture → expected tidy rows, and money-math checks."""

from decimal import Decimal
from pathlib import Path

import pytest

from transforms.omb_receipts import parse_receipts, validate_receipts

FIXTURES = Path(__file__).parent / "fixtures"
M = Decimal(1_000_000)


@pytest.fixture(scope="module")
def rows():
    return parse_receipts(FIXTURES / "receipts_mini.xlsx")


def by(rows, code, year):
    return next(r for r in rows if r.category_code == code and r.fiscal_year == year)


def test_expected_tidy_rows(rows):
    indiv = by(rows, "individual_income_taxes", 2000)
    assert indiv.amount == 100 * M
    assert indiv.metric == "receipt"
    assert indiv.government_level == "federal"
    assert indiv.amount_unit == "usd_nominal"
    assert indiv.parent_category_code == "TOTAL"
    assert indiv.is_projection is False

    total = by(rows, "TOTAL", 2000)
    assert total.amount == 201 * M
    assert total.parent_category_code is None
    assert total.category_name == "Total Receipts"


def test_footnote_markers_stripped(rows):
    corp = by(rows, "corporation_income_taxes", 2000)
    assert "(1)" not in corp.category_name


def test_social_insurance_uses_total_column_not_on_off_split(rows):
    assert by(rows, "social_insurance_retirement", 2000).amount == 30 * M


def test_tq_row_excluded(rows):
    assert {r.fiscal_year for r in rows} == {2000, 2001, 2026}


def test_estimate_year_is_projection(rows):
    assert by(rows, "TOTAL", 2026).is_projection is True
    assert by(rows, "TOTAL", 2001).is_projection is False


def test_category_sums_match_totals_within_tolerance(rows):
    report = validate_receipts(rows)
    report.raise_if_failed()
    assert report.checks == 3
    # FY2001 has a deliberate $1M rounding artifact; it must pass.
    assert report.max_delta_usd == 1 * M


def test_bad_total_fails_validation():
    rows = parse_receipts(FIXTURES / "receipts_bad_total.xlsx")
    report = validate_receipts(rows)
    with pytest.raises(ValueError, match="receipts FY2000"):
        report.raise_if_failed()
