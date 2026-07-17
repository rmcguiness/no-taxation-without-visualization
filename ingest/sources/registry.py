"""Registry of data sources we ingest.

URLs point at the FY2027 President's Budget edition of the OMB Historical
Tables (published April 2026). OMB rehosts these files under a new path each
budget year; when a new edition appears, update `url` (and nothing else) —
the content hash keeps old and new vintages distinct.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Source:
    id: str
    name: str
    publisher: str
    url: str
    homepage_url: str
    license: str
    confidence: str  # high / medium / low / incomplete
    notes: str = ""


OMB_HOMEPAGE = "https://www.whitehouse.gov/omb/information-resources/budget/historical-tables/"

SOURCES: dict[str, Source] = {
    "omb_hist_2_1": Source(
        id="omb_hist_2_1",
        name="OMB Historical Table 2.1 — Receipts by Source",
        publisher="Office of Management and Budget",
        url="https://www.whitehouse.gov/wp-content/uploads/2026/04/hist02z1_fy2027.xlsx",
        homepage_url=OMB_HOMEPAGE,
        license="public domain (U.S. government work)",
        confidence="high",
        notes=(
            "FY1934-FY2031; FY2026+ are estimates (is_projection). Amounts in "
            "millions of USD in source; stored as nominal USD. TQ (transition "
            "quarter, 1976) excluded. On/off-budget splits not ingested in Phase 1."
        ),
    ),
    "omb_hist_3_2": Source(
        id="omb_hist_3_2",
        name="OMB Historical Table 3.2 — Outlays by Function and Subfunction",
        publisher="Office of Management and Budget",
        url="https://www.whitehouse.gov/wp-content/uploads/2026/04/hist03z2_fy2027.xlsx",
        homepage_url=OMB_HOMEPAGE,
        license="public domain (U.S. government work)",
        confidence="high",
        notes=(
            "FY1962-FY2031; FY2026+ are estimates (is_projection). Amounts in "
            "millions of USD in source; stored as nominal USD. TQ column excluded. "
            "On/off-budget splits not ingested in Phase 1."
        ),
    ),
}
