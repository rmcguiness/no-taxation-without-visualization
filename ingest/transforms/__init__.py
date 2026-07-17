"""Raw → tidy transforms.

Each transform takes a registered raw snapshot and produces long-format rows
(e.g. fiscal_series) with validation: category sums must match published totals
within rounding tolerance.
"""
