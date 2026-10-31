-- Sample data (the original mock inventory). Run after schema.sql. Safe to re-run.

insert into public.inventory_items
  (item_number, name, sku, batch_number, category, location, quantity, unit, min_threshold, supplier, last_updated)
values
  ('ITM-1001', 'Wireless Barcode Scanner', 'ELEC-BCS-100', 'BATCH-2024-A1', 'Electronics', 'Warehouse A - Aisle 1', 84, 'pcs', 20, 'TechSource Manila', '2026-09-10'),
  ('ITM-1002', 'A4 Copy Paper (Ream)', 'OFF-PPR-210', 'BATCH-2024-B7', 'Office Supplies', 'Warehouse A - Aisle 2', 12, 'reams', 25, 'PaperWorks Trading', '2026-09-12'),
  ('ITM-1003', 'Ergonomic Office Chair', 'FUR-CHR-330', 'BATCH-2024-C3', 'Furniture', 'Warehouse B - Cold Storage', 0, 'pcs', 5, 'OfficeFit Industries', '2026-09-08'),
  ('ITM-1004', 'Corrugated Shipping Boxes (M)', 'PKG-BOX-450', 'BATCH-2024-D9', 'Packaging', 'Warehouse A - Aisle 3', 320, 'pcs', 100, 'BoxPro Packaging', '2026-09-14'),
  ('ITM-1005', 'Stainless Steel Bolts (M8)', 'RAW-BLT-088', 'BATCH-2024-E2', 'Raw Materials', 'Warehouse C', 18, 'kg', 30, 'Metal Alliance Corp', '2026-09-11'),
  ('ITM-1006', 'Bottled Water 500ml (Case)', 'FNB-WTR-500', 'BATCH-2024-F4', 'Food & Beverage', 'Store Front', 56, 'cases', 15, 'AquaPure Distribution', '2026-09-13'),
  ('ITM-1007', 'USB-C Charging Cable 1m', 'ELEC-CBL-201', 'BATCH-2024-G6', 'Electronics', 'Warehouse A - Aisle 1', 9, 'pcs', 25, 'TechSource Manila', '2026-09-15'),
  ('ITM-1008', 'Whiteboard Markers (Set of 12)', 'OFF-MRK-112', 'BATCH-2024-H8', 'Office Supplies', 'Warehouse A - Aisle 2', 47, 'sets', 10, 'PaperWorks Trading', '2026-09-07'),
  ('ITM-1009', 'Stackable Storage Bin (Large)', 'FUR-BIN-500', 'BATCH-2024-I1', 'Furniture', 'Warehouse B - Cold Storage', 3, 'pcs', 8, 'OfficeFit Industries', '2026-09-09'),
  ('ITM-1010', 'Bubble Wrap Roll 100m', 'PKG-BWR-100', 'BATCH-2024-J5', 'Packaging', 'Warehouse A - Aisle 3', 62, 'rolls', 20, 'BoxPro Packaging', '2026-09-06'),
  ('ITM-1011', 'Aluminum Sheet 2mm', 'RAW-ALU-200', 'BATCH-2024-K7', 'Raw Materials', 'Warehouse C', 0, 'sheets', 10, 'Metal Alliance Corp', '2026-09-04'),
  ('ITM-1012', 'Instant Coffee Sachets (Box)', 'FNB-COF-024', 'BATCH-2024-L9', 'Food & Beverage', 'Store Front', 21, 'boxes', 10, 'AquaPure Distribution', '2026-09-05'),
  ('ITM-1013', '27-inch LED Monitor', 'ELEC-MON-270', 'BATCH-2024-M2', 'Electronics', 'Warehouse A - Aisle 1', 14, 'pcs', 5, 'TechSource Manila', '2026-09-02'),
  ('ITM-1014', 'Sticky Notes 3x3 (Pack of 12)', 'OFF-STN-303', 'BATCH-2024-N4', 'Office Supplies', 'Store Front', 6, 'packs', 15, 'PaperWorks Trading', '2026-09-13'),
  ('ITM-1015', 'Adjustable Standing Desk', 'FUR-DSK-620', 'BATCH-2024-O6', 'Furniture', 'Warehouse B - Cold Storage', 27, 'pcs', 6, 'OfficeFit Industries', '2026-08-30'),
  ('ITM-1016', 'Stretch Wrap Film 500mm', 'PKG-SWF-500', 'BATCH-2024-P8', 'Packaging', 'Warehouse A - Aisle 3', 8, 'rolls', 15, 'BoxPro Packaging', '2026-09-15')
on conflict (item_number) do nothing;

-- New items continue numbering after the seeded ones.
select setval('public.item_number_seq', greatest((select last_value from public.item_number_seq), 1016));

insert into public.item_history (item_id, type, description, date, user_name)
select i.id, h.type, h.description, h.date::date, h.user_name
from (values
  ('ITM-1001', 'Received', 'Restocked 40 units from supplier', '2026-09-10', 'Mika Santos'),
  ('ITM-1001', 'Moved', 'Transferred from Warehouse B to Warehouse A', '2026-08-28', 'Carlo Reyes'),
  ('ITM-1001', 'Received', 'Initial stock received', '2026-08-01', 'Mika Santos'),
  ('ITM-1002', 'Adjusted', 'Quantity adjusted after physical count', '2026-09-12', 'Liza Torres'),
  ('ITM-1002', 'Moved', 'Moved 50 reams to Store Front', '2026-09-05', 'Carlo Reyes'),
  ('ITM-1002', 'Received', 'Received 100 reams from supplier', '2026-08-15', 'Mika Santos'),
  ('ITM-1003', 'Adjusted', 'Marked as out of stock after fulfillment', '2026-09-08', 'Liza Torres'),
  ('ITM-1003', 'Moved', 'Shipped 8 units to client site', '2026-09-01', 'Carlo Reyes'),
  ('ITM-1003', 'Received', 'Initial batch received', '2026-07-20', 'Mika Santos'),
  ('ITM-1004', 'Restocked', 'Restocked 200 units', '2026-09-14', 'Mika Santos'),
  ('ITM-1004', 'Moved', 'Distributed to 3 outbound orders', '2026-09-09', 'Carlo Reyes'),
  ('ITM-1005', 'Adjusted', 'Used 22kg for production run #114', '2026-09-11', 'Liza Torres'),
  ('ITM-1005', 'Received', 'Received 40kg shipment', '2026-08-22', 'Mika Santos'),
  ('ITM-1006', 'Received', 'Weekly delivery received', '2026-09-13', 'Mika Santos'),
  ('ITM-1006', 'Moved', 'Moved 10 cases to Store Front', '2026-09-06', 'Carlo Reyes'),
  ('ITM-1007', 'Adjusted', 'Quantity adjusted after damage report', '2026-09-15', 'Liza Torres'),
  ('ITM-1007', 'Received', 'Restocked 50 units', '2026-08-30', 'Mika Santos'),
  ('ITM-1008', 'Received', 'Received 30 sets from supplier', '2026-09-07', 'Mika Santos'),
  ('ITM-1009', 'Moved', 'Moved 5 units to Warehouse C', '2026-09-09', 'Carlo Reyes'),
  ('ITM-1009', 'Received', 'Initial stock received', '2026-08-05', 'Mika Santos'),
  ('ITM-1010', 'Received', 'Restocked 40 rolls', '2026-09-06', 'Mika Santos'),
  ('ITM-1011', 'Adjusted', 'All remaining stock consumed', '2026-09-04', 'Liza Torres'),
  ('ITM-1011', 'Received', 'Received 15 sheets', '2026-08-10', 'Mika Santos'),
  ('ITM-1012', 'Received', 'Received 15 boxes', '2026-09-05', 'Mika Santos'),
  ('ITM-1013', 'Restocked', 'Restocked 6 units', '2026-09-02', 'Mika Santos'),
  ('ITM-1013', 'Moved', 'Shipped 4 units to branch office', '2026-08-25', 'Carlo Reyes'),
  ('ITM-1014', 'Moved', 'Moved 10 packs to Store Front', '2026-09-13', 'Carlo Reyes'),
  ('ITM-1015', 'Received', 'Received 12 units', '2026-08-30', 'Mika Santos'),
  ('ITM-1016', 'Adjusted', 'Used 12 rolls for outbound shipments', '2026-09-15', 'Liza Torres'),
  ('ITM-1016', 'Received', 'Received 10 rolls', '2026-08-18', 'Mika Santos')
) as h (item_number, type, description, date, user_name)
join public.inventory_items i on i.item_number = h.item_number
where not exists (select 1 from public.item_history where item_id = i.id);
