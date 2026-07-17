"""Smoke test: the package skeleton imports cleanly."""

import sources
import transforms


def test_packages_import() -> None:
    assert sources.__doc__ is not None
    assert transforms.__doc__ is not None
