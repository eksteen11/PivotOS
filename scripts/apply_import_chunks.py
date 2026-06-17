#!/usr/bin/env python3
"""Apply prepared DJ Werk import SQL chunks to Supabase Postgres."""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import psycopg2
except ImportError:
    print("Install psycopg2-binary first: pip install psycopg2-binary", file=sys.stderr)
    raise

PROJECT_REF = "vntcdfzumwjgefyxhkie"
USER_ID = "536d3701-329a-45b9-b683-4b2f9c7bdb53"
CHUNK_DIR = Path(__file__).resolve().parents[1] / "supabase" / "migrations" / "_import_chunks"


def connect(password: str):
    return psycopg2.connect(
        host=f"db.{PROJECT_REF}.supabase.co",
        dbname="postgres",
        user="postgres",
        password=password,
        port=5432,
        sslmode="require",
    )


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: apply_import_chunks.py <db_password>", file=sys.stderr)
        return 1

    password = sys.argv[1]
    conn = connect(password)
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute("select count(*) from public.items where user_id = %s", (USER_ID,))
    before = cur.fetchone()[0]
    print(f"Before: {before} items")

    total_imported = 0
    for i in range(10):
        path = CHUNK_DIR / f"chunk_{i:03d}.sql"
        sql = path.read_text(encoding="utf-8")
        print(f"Running chunk {i} ({len(sql)} bytes)...", flush=True)
        cur.execute(sql)
        row = cur.fetchone()
        count = row[0] if row else 0
        total_imported += count or 0
        print(f"  -> imported {count}")

    cur.execute(
        """
        select count(*) as total,
               count(*) filter (where meta->>'seed_batch' = 'dj_werk_full_v1') as imported
        from public.items where user_id = %s
        """,
        (USER_ID,),
    )
    total, imported = cur.fetchone()
    print(f"After: {total} items ({imported} from dj_werk_full_v1)")
    print(f"Chunk function reported: {total_imported}")

    cur.execute(
        """
        select e.slug, count(i.id)
        from public.items i
        join public.entities e on e.id = i.entity_id
        where i.user_id = %s and i.meta->>'seed_batch' = 'dj_werk_full_v1'
        group by e.slug order by e.slug
        """,
        (USER_ID,),
    )
    print("By entity:")
    for slug, n in cur.fetchall():
        print(f"  {slug}: {n}")

    cur.close()
    conn.close()
    return 0 if imported == 799 else 1


if __name__ == "__main__":
    raise SystemExit(main())
