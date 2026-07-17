"""Generate the tiny xlsx fixtures mimicking OMB Historical Table layouts.

Run from ingest/:  .venv/bin/python tests/fixtures/make_fixtures.py

The fixtures replicate every layout quirk the transforms must handle: two-row
headers with footnote markers, the TQ transition-quarter row/column, 'estimate'
year labels, dot-runs for missing values, (On/Off-budget) split rows, uncoded
detail rows, single-subfunction functions without 'Total,' rows, negative
undistributed offsetting receipts, and footer notes. The *_bad_total variants
carry a total that is deliberately ~$100M off so validation must fail.
"""

from pathlib import Path

import openpyxl

HERE = Path(__file__).parent
DOTS = ".........."


def make_receipts(path: Path, *, break_total: bool = False) -> None:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Table"
    ws.append(["Table 2.1 - RECEIPTS BY SOURCE:  2000 - 2026"])
    ws.append(["(in millions of dollars)"])
    ws.append(
        [
            "Fiscal Year",
            "Individual Income Taxes",
            "Corporation Income Taxes (1)",
            "Social Insurance and Retirement Receipts (2)",
            None,
            None,
            "Excise Taxes (2)",
            "Other (3)",
            "Total Receipts",
            None,
            None,
        ]
    )
    ws.append(
        [None, None, None, "Total", "(On - Budget)", "(Off - Budget)", None, None,
         "Total", "(On - Budget)", "(Off - Budget)"]
    )
    # components: indiv, corp, soc(total,on,off), excise, other, total(total,on,off)
    ws.append(["2000", 100, 50, 30, 20, 10, 5, 16, 300 if break_total else 201, 191, 10])
    # FY2001 total is 1M under the component sum: a real rounding artifact.
    ws.append(["2001", 102, 51, 31, 21, 10, 5, 16, 204, 194, 10])
    ws.append(["TQ", 999, 999, 999, 999, 999, 999, 999, 4995, 3996, 999])
    ws.append(["2026 estimate", 110, 55, 33, 22, 11, 6, 17, 221, 210, 11])
    ws.append(["(1) A footnote."])
    ws.append(["(2) See Table 2.4 for additional details"])
    wb.save(path)


def make_outlays(path: Path, *, break_total: bool = False) -> None:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Table"
    ws.append(["Table 3.2 - OUTLAYS BY FUNCTION AND SUBFUNCTION:  1999 - 2026"])
    ws.append(["(in millions of dollars)"])
    ws.append(["Function and Subfunction", "1999", "2000", "TQ", "2026 estimate"])
    rows = [
        ["050 National Defense:"],
        ["051 Department of Defense-Military:"],
        ["Military Personnel", 10, 11, 1, 12],
        ["Operation and Maintenance", 5, 6, 1, 7],
        ["051 Subtotal, Department of Defense-Military", 15, 17, 2, 19],
        ["053 Atomic energy defense activities", 2, 3, 1, 4],
        ["Total, National Defense", 17, 120 if break_total else 20, 3, 23],
        ["150 International Affairs:"],
        ["151 International development and humanitarian assistance", 4, 5, DOTS, 6],
        ["152 International security assistance", 1, 1, 1, 1],
        ["Total, International Affairs", 5, 6, 1, 7],
        ["570 Medicare:"],
        ["571 Medicare", DOTS, 30, 2, 35],
        ["950 Undistributed Offsetting Receipts:"],
        ["951 Employer share, employee retirement (on-budget)", -3, -4, -1, -5],
        ["Total, Undistributed Offsetting Receipts", -3, -4, -1, -5],
        ["(On-budget)", -3, -4, -1, -5],
        ["Total outlays", 19, 52, 5, 60],
        ["(On-budget)", 19, 52, 5, 60],
        ["(Off-budget)", DOTS, DOTS, DOTS, DOTS],
        ["N/A = Not available"],
        ["On-budget unless otherwise stated"],
    ]
    for row in rows:
        ws.append(row)
    wb.save(path)


if __name__ == "__main__":
    make_receipts(HERE / "receipts_mini.xlsx")
    make_receipts(HERE / "receipts_bad_total.xlsx", break_total=True)
    make_outlays(HERE / "outlays_mini.xlsx")
    make_outlays(HERE / "outlays_bad_total.xlsx", break_total=True)
    print("fixtures written to", HERE)
