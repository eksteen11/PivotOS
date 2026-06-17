#!/usr/bin/env python3
"""Parse DJ Werk xlsx and emit JSON payload + apply to Supabase via MCP-sized chunks."""

from __future__ import annotations

import json
import re
import sys
import zipfile
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET

XLSX = Path("/Users/djeksteen/Downloads/DJ Werk - 2026 - V1.1 (3).xlsx")
OUT_JSON = Path(__file__).resolve().parents[1] / "supabase" / "import_dj_werk_payload.json"
USER_ID = "536d3701-329a-45b9-b683-4b2f9c7bdb53"

A = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def col_letter(ref: str) -> str:
    return re.match(r"[A-Z]+", ref).group(0)


def excel_date(value: str | None) -> str | None:
    if not value:
        return None
    try:
        n = float(value)
        if 40000 < n < 50000:
            return (datetime(1899, 12, 30) + timedelta(days=n)).date().isoformat()
    except ValueError:
        pass
    return None


@dataclass
class ActivityRow:
    entity_slug: str
    division_slug: str | None
    workstream_slug: str | None
    workstream_label: str
    item_type: str
    title: str
    content: str
    owner: str | None
    value: float | None
    due_date: str | None
    meta: dict = field(default_factory=dict)


class XlsxReader:
    def __init__(self, path: Path):
        self.z = zipfile.ZipFile(path)
        self.shared: list[str] = []
        sst = ET.fromstring(self.z.read("xl/sharedStrings.xml"))
        for si in sst:
            self.shared.append("".join(t.text or "" for t in si.iter(f"{A}t")))

    def rows(self, sheet_path: str) -> list[dict[str, str]]:
        root = ET.fromstring(self.z.read(f"xl/{sheet_path}"))
        out: list[dict[str, str]] = []
        data = root.find(f"{A}sheetData")
        if data is None:
            return out
        for row in data.findall(f"{A}row"):
            cells: dict[str, str] = {}
            for cell in row.findall(f"{A}c"):
                ref = cell.get("r") or ""
                t = cell.get("t")
                v = cell.find(f"{A}v")
                isv = cell.find(f"{A}is")
                val = ""
                if t == "s" and v is not None:
                    val = self.shared[int(v.text)]
                elif t == "inlineStr" and isv is not None:
                    val = "".join(x.text or "" for x in isv.iter(f"{A}t"))
                elif v is not None:
                    val = v.text or ""
                if val:
                    cells[col_letter(ref)] = val
            if cells:
                out.append(cells)
        return out


DJ_WS = {
    "beplan": "dj_planning",
    "planning": "dj_planning",
    "plekke": "dj_planning",
    "income / coding": "dj_income",
    "income / coding - tools": "dj_income",
    "inkomste/idees": "dj_ideas",
    "betaal": "dj_finances",
    "skuld": "dj_finances",
    "kerk": "dj_church",
    "aw/me": "dj_family",
    "testament / versekering": "dj_admin",
    "medies": "dj_health",
}

NP_WS = {
    "admin": "np_admin",
    "propverse": "np_propverse",
    "meetings": "np_viewings",
    "buyer": "np_buyers",
    "sell": "np_sellers",
    "verkoop": "np_sellers",
    "viewings": "np_viewings",
    "tenant": "np_tenants",
    "rental": "np_rentals",
    "agent": "np_marketing",
    "otp": "np_deals",
    "investor": "np_leads",
    "deals": "np_deals",
    "nazeem": "np_leads",
}

FF_WS = {
    "verkoop": "ff_sales",
    "fin/admin": "ff_finadmin",
    "betaal": "ff_finadmin",
    "soek": "ff_sourcing",
    "laai": "ff_logistics",
    "listing": "ff_listings",
    "coding": "ff_trading",
    "safex - daagliks": "ff_safex",
}

AGENCY_WS = {
    "laai": "agency_loads",
    "verkope": "agency_sales",
    "verkoop": "agency_sales",
    "aankope": "agency_buyers",
    "buyers": "agency_buyers",
    "sellers": "agency_sellers",
    "auctions": "agency_auctions",
    "marketing": "agency_marketing",
    "meetings": "agency_meetings",
}

PROPERTY_WS = {
    "levies / hoa": "property_levies",
    "legal": "property_legal",
    "municipality": "property_levies",
    "banks": "property_acquisitions",
    "build / renovate": "property_development",
    "electrical": "property_development",
    "viewings/verkope": "property_sales",
    "meetings": "property_sales",
}

ERHARD_WS = {
    "stock": "erhard_stock",
    "eiendom - plaas": "erhard_farming",
    "verkope": "erhard_sales",
    "expenses": "erhard_expenses",
    "fin state / reports": "erhard_reports",
    "idees planne": "erhard_containers",
    "finansies": "erhard_cash",
    "aankope": "erhard_purchases",
    "meetings": "erhard_farming",
}

FINADMIN_WS = {
    "betaal": "finadmin_payments",
    "conrad bespreek": "finadmin_cashflow",
    "finansies": "finadmin_accounting",
    "struktuur/organisasie/ aandele": "finadmin_structure",
    "werknemers": "finadmin_employees",
    "finansiering": "finadmin_cashflow",
    "systems": "finadmin_reporting",
    "versekering": "finadmin_insurance",
}

TIAAN_WS = {
    "meeting": "tiaan_strategic",
    "meetings": "tiaan_strategic",
    "main 1": "tiaan_strategic",
    "main 2": "tiaan_investments",
    "idees / projekte": "tiaan_ventures",
    "lenings / finansiering": "tiaan_financing",
    "presentations": "tiaan_strategic",
    "plekke/locations": "tiaan_investments",
    "shareholding": "tiaan_shareholding",
}

WEB_WS = {
    "major builds": "website_revenue",
    "revenue producing builds": "website_revenue",
    "features": "website_features",
    "payment gateways": "website_payments",
    "jira": "website_bugs",
    "new projects": "website_revenue",
    "hosting": "website_hosting",
    "email": "website_dev",
}

TERTIUS_WS = {
    "deelwei": "tertius_farming",
    "verkope": "tertius_sales",
    "aankope": "tertius_trading",
    "expenses": "tertius_farming",
    "stock": "tertius_stock",
}

PROJECTS_WS = {"projek": "projects_ventures"}


def map_ws(label: str, mapping: dict[str, str]) -> str | None:
    key = label.strip().lower()
    if key in mapping:
        return mapping[key]
    for k, v in mapping.items():
        if k in key or key in k:
            return v
    return None


def infer_type(dept: str, title: str) -> str:
    d = dept.lower()
    t = title.lower()
    if "meeting" in d or "vergader" in t:
        return "meeting"
    if d in ("buyer", "sell", "viewings", "tenant", "rental", "investor", "nazeem"):
        return "lead"
    if d in ("deals", "otp") or "deal" in t:
        return "deal"
    if d in ("verkope", "verkoop") or "verkoop" in t:
        return "sale"
    if "idee" in d or "idea" in t or "projek" in d:
        return "idea"
    if d in ("betaal",) or "invoice" in t:
        return "payment"
    if "skuld" in d or "expense" in d:
        return "expense"
    if "opportunity" in t:
        return "opportunity"
    if "coding" in d or "build" in d:
        return "project"
    return "task"


def add(rows: list[ActivityRow], **kwargs) -> None:
    title = (kwargs.get("title") or "").strip()
    if not title or len(title) < 2:
        return
    skip = {"taak/afdeling", "department", "task", "date", "type", "agents", "parties"}
    if title.lower() in skip:
        return
    rows.append(ActivityRow(**kwargs))


def parse_all(reader: XlsxReader) -> list[ActivityRow]:
    out: list[ActivityRow] = []
    entity_map = {
        "Digikraal": "digikraal",
        "DJ Eksteen": "dj",
        "Farm Feed": "farm_feed",
        "Northpoint": "northpoint",
        "North Point": "northpoint",
    }

    for r in reader.rows("worksheets/sheet2.xml"):
        ent = (r.get("C") or "").strip()
        if ent not in entity_map:
            continue
        title = (r.get("G") or r.get("F") or "").strip()
        if not title:
            continue
        add(
            out,
            entity_slug=entity_map[ent],
            division_slug=None,
            workstream_slug="agency_meetings" if entity_map[ent] == "digikraal" else None,
            workstream_label="Meetings",
            item_type="meeting",
            title=title[:200],
            content=(r.get("G") or "")[:2000],
            owner=(r.get("F") or "").strip() or None,
            value=None,
            due_date=excel_date(r.get("D")),
            meta={"who": r.get("F"), "where": r.get("H"), "time": r.get("E"), "sheet": "1. Meet"},
        )

    for r in reader.rows("worksheets/sheet3.xml"):
        cat = (r.get("C") or "").strip()
        task = (r.get("D") or "").strip()
        if not task:
            continue
        ws_label = cat or "General"
        add(
            out,
            entity_slug="dj",
            division_slug=None,
            workstream_slug=map_ws(ws_label, DJ_WS),
            workstream_label=ws_label,
            item_type=infer_type(ws_label, task),
            title=task[:200],
            content="",
            owner=None,
            value=None,
            due_date=excel_date(r.get("B")),
            meta={"sheet": "2. DJ", "where": r.get("E")},
        )

    for r in reader.rows("worksheets/sheet4.xml"):
        dept = (r.get("D") or "").strip()
        if not dept:
            continue
        if dept.lower().startswith("deals") and r.get("I") and r.get("J"):
            title = (r.get("G") or r.get("J") or "Deal")[:200]
            try:
                value = float(r.get("O") or r.get("N") or 0) or None
            except ValueError:
                value = None
            add(
                out,
                entity_slug="northpoint",
                division_slug=None,
                workstream_slug="np_deals",
                workstream_label="Deals",
                item_type="deal",
                title=title,
                content=(r.get("J") or "")[:2000],
                owner=(r.get("F") or "").strip() or None,
                value=value,
                due_date=excel_date(r.get("C")),
                meta={
                    "sheet": "3.NP",
                    "deal_code": r.get("I"),
                    "location": r.get("H"),
                    "commission": r.get("O"),
                },
            )
            continue
        if dept in ("Buyer", "Sell", "Viewings", "Tenant", "Rental", "Agent", "OTP", "Investor", "Verkoop", "Nazeem"):
            title = (r.get("G") or r.get("E") or "").strip()
            owner = (r.get("F") or "").strip() or None
            add(
                out,
                entity_slug="northpoint",
                division_slug=None,
                workstream_slug=map_ws(dept, NP_WS),
                workstream_label=dept,
                item_type=infer_type(dept, title),
                title=title[:200] or owner or dept,
                content=f"{r.get('E') or ''} · {r.get('H') or ''}".strip(" ·"),
                owner=owner,
                value=None,
                due_date=excel_date(r.get("C")),
                meta={"sheet": "3.NP", "property_type": r.get("E"), "location": r.get("H")},
            )
            continue
        task = (r.get("E") or "").strip()
        if task and dept not in ("Department", "Meetings", "Deals Process", "Propverse", "Deals"):
            add(
                out,
                entity_slug="northpoint",
                division_slug=None,
                workstream_slug=map_ws(dept, NP_WS),
                workstream_label=dept,
                item_type=infer_type(dept, task),
                title=task[:200],
                content="",
                owner=None,
                value=None,
                due_date=excel_date(r.get("C")),
                meta={"sheet": "3.NP"},
            )

    for r in reader.rows("worksheets/sheet5.xml"):
        ws = (r.get("D") or "").strip()
        task = (r.get("E") or "").strip()
        if not ws or not task or ws.startswith("Week"):
            continue
        add(
            out,
            entity_slug="farm_feed",
            division_slug=None,
            workstream_slug=map_ws(ws, FF_WS),
            workstream_label=ws,
            item_type=infer_type(ws, task),
            title=task[:200],
            content="",
            owner=None,
            value=None,
            due_date=excel_date(r.get("C")),
            meta={"sheet": "4. FF"},
        )

    for r in reader.rows("worksheets/sheet6.xml"):
        ws = (r.get("E") or "").strip()
        task = (r.get("F") or "").strip()
        if not ws or not task:
            continue
        add(
            out,
            entity_slug="digikraal",
            division_slug="dk_agency",
            workstream_slug=map_ws(ws, AGENCY_WS),
            workstream_label=ws,
            item_type=infer_type(ws, task),
            title=task[:200],
            content="",
            owner=None,
            value=None,
            due_date=excel_date(r.get("D")) or excel_date(r.get("C")),
            meta={"sheet": "5.1 DK % Agent", "week": r.get("C")},
        )

    pricing_title: str | None = None
    ladder: list[dict] = []
    for r in reader.rows("worksheets/sheet7.xml"):
        c = (r.get("C") or "").strip()
        d = (r.get("D") or "").strip()
        e = (r.get("E") or "").strip()
        if c and not d and not e and not c.replace(".", "").isdigit():
            if pricing_title and ladder:
                add(
                    out,
                    entity_slug="digikraal",
                    division_slug="dk_agency",
                    workstream_slug="agency_sales",
                    workstream_label="Pricing Calculator",
                    item_type="process",
                    title=f"{pricing_title} — price ladder"[:200],
                    content=f"{len(ladder)} kg/R/kg tiers",
                    owner=None,
                    value=ladder[-1]["total"] if ladder else None,
                    due_date=None,
                    meta={"sheet": "5.2 DK % Agent", "pricing_calculator": True, "scenario": pricing_title, "tiers": ladder},
                )
            pricing_title = c
            ladder = []
            continue
        if c.replace(".", "").isdigit() and d.replace(".", "").replace("-", "").isdigit():
            try:
                kg = float(c)
                rkg = float(d)
                ladder.append({"kg": kg, "r_per_kg": rkg, "adjustment": float(e) if e else 0, "total": round(kg * rkg, 2)})
            except ValueError:
                pass
    if pricing_title and ladder:
        add(
            out,
            entity_slug="digikraal",
            division_slug="dk_agency",
            workstream_slug="agency_sales",
            workstream_label="Pricing Calculator",
            item_type="process",
            title=f"{pricing_title} — price ladder"[:200],
            content=f"{len(ladder)} kg/R/kg tiers",
            owner=None,
            value=ladder[-1]["total"] if ladder else None,
            due_date=None,
            meta={"sheet": "5.2 DK % Agent", "pricing_calculator": True, "scenario": pricing_title, "tiers": ladder},
        )

    sheet_div_map = [
        ("worksheets/sheet8.xml", "dk_property", PROPERTY_WS, "6. DK Eien"),
        ("worksheets/sheet9.xml", "dk_erhard", ERHARD_WS, "7. DK - Erhard"),
        ("worksheets/sheet10.xml", "dk_finadmin", FINADMIN_WS, "8. DK FinAd"),
        ("worksheets/sheet11.xml", "dk_tiaan", TIAAN_WS, "9. DK Tiaan"),
        ("worksheets/sheet14.xml", "dk_website", WEB_WS, "12. DK Web"),
    ]
    for path, div, mapping, sheet in sheet_div_map:
        for r in reader.rows(path):
            ws = (r.get("D") or "").strip()
            task = (r.get("E") or "").strip()
            if not ws or not task or ws.startswith("Week"):
                continue
            add(
                out,
                entity_slug="digikraal",
                division_slug=div,
                workstream_slug=map_ws(ws, mapping),
                workstream_label=ws,
                item_type=infer_type(ws, task),
                title=task[:200],
                content="",
                owner=None,
                value=None,
                due_date=excel_date(r.get("C")),
                meta={"sheet": sheet, "week": r.get("B")},
            )

    for r in reader.rows("worksheets/sheet12.xml"):
        ws = (r.get("B") or "").strip()
        task = (r.get("C") or "").strip()
        if not ws or not task:
            continue
        add(
            out,
            entity_slug="digikraal",
            division_slug="dk_tertius",
            workstream_slug=map_ws(ws, TERTIUS_WS),
            workstream_label=ws,
            item_type=infer_type(ws, task),
            title=task[:200],
            content="",
            owner=None,
            value=None,
            due_date=excel_date(r.get("C")),
            meta={"sheet": "10. DK Tertius"},
        )

    for r in reader.rows("worksheets/sheet13.xml"):
        ws = (r.get("B") or "").strip()
        task = (r.get("C") or "").strip()
        if not ws or not task:
            continue
        add(
            out,
            entity_slug="digikraal",
            division_slug="dk_projects",
            workstream_slug=map_ws(ws, PROJECTS_WS),
            workstream_label=ws,
            item_type=infer_type(ws, task),
            title=task[:200],
            content="",
            owner=None,
            value=None,
            due_date=None,
            meta={"sheet": "11. DK Projekte"},
        )

    return out


def to_payload(rows: list[ActivityRow]) -> list[dict]:
    payload = []
    for row in rows:
        meta = {**row.meta, "seed_batch": "dj_werk_full_v1", "entity_slug": row.entity_slug}
        if row.division_slug:
            meta["division_slug"] = row.division_slug
        if row.workstream_slug:
            meta["workstream_slug"] = row.workstream_slug
        if row.workstream_label:
            meta["workstream_label"] = row.workstream_label
        payload.append(
            {
                "entity_slug": row.entity_slug,
                "division_slug": row.division_slug,
                "workstream_slug": row.workstream_slug,
                "type": row.item_type,
                "title": row.title[:200],
                "content": row.content[:2000],
                "owner": row.owner,
                "value": row.value,
                "due_date": row.due_date,
                "meta": meta,
            }
        )
    return payload


def main() -> int:
    if not XLSX.exists():
        print(f"Missing xlsx: {XLSX}", file=sys.stderr)
        return 1
    reader = XlsxReader(XLSX)
    rows = parse_all(reader)
    payload = to_payload(rows)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"Parsed {len(payload)} activities -> {OUT_JSON}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
