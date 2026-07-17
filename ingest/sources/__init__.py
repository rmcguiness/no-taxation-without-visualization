"""Data-source fetchers.

One module per source (e.g. omb_historical_tables.py in Phase 1). Each fetcher
downloads the raw file, stores it immutably under data/raw/{source}/{date}/,
computes its sha256, and registers a dataset_snapshot.
"""
