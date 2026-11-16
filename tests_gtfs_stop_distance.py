#!/usr/bin/env python3
"""Regression for text coordinates from GTFS/SQLite distance audit."""
from runpy import run_path

meters=run_path('oracle-romania-transport/audit-stop-distances.py')['meters']
a=('7353','Zetarilor','44.000','26.000')
b=('3642','Cimitirul Serban Voda','44.001','26.000')
distance=meters(a,b)
assert round(distance)==111, distance
assert abs(meters(a,b)-meters(('7353','Zetarilor',44.0,26.0),('3642','Cimitirul Serban Voda',44.001,26.0)))<1e-6
assert meters(a,a)==0
print('PASS: GTFS distance audit handles string and numeric coordinates')
