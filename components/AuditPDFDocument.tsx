"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  Image,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { Category, AuditItem } from "@/lib/types";

// ==================================================
// Register nice font (Open Sans) – looks professional
// ==================================================
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
      fontWeight: 700,
    },
  ],
});

// ==================================================
// PDF Styles – matches your app design
// ==================================================
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Open Sans", fontSize: 11, color: "#1a2d53", lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, alignItems: "center" },
  logo: { width: 60, height: 60, objectFit: "contain" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", textDecoration: "underline" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, fontSize: 10.5 },
  infoBlock: { width: "48%" },
  keys: { marginBottom: 20, fontSize: 10, lineHeight: 1.6 },
  table: { borderWidth: 1.5, borderColor: "#000", marginTop: 10 },
  row: { flexDirection: "row" },
  cell: { borderWidth: 1, borderColor: "#000", padding: 6, textAlign: "center" },
  headerCell: { backgroundColor: "#d0e0ff", fontWeight: "bold", fontSize: 10 },
  categoryHeader: { backgroundColor: "#e6f0ff", fontWeight: "bold", fontSize: 11 },
  colNum: { width: 40 },
  colElement: { width: 100, textAlign: "left" },
  colComment: { flex: 1, textAlign: "left" ,width: 50},
  colOutOf: { width: 50 },
  colScore: { width: 50 },
  colAction: { width: 110 },
  colYN: { width: 70 },
  summary: { marginTop: 30, fontSize: 14, fontWeight: "bold", textAlign: "right" },
});

// ==================================================
// Export function – used in your main component
// ==================================================
export async function exportAuditToPDF(
  categories: Category[],
  inspectedBy: string,
  date: string,
  time: string,
  location: string,
  department: string
) {
  const doc = (
    <AuditPDFDocument
      categories={categories}
      inspectedBy={inspectedBy}
      date={date}
      time={time}
      location={location}
      department={department}
    />
  );
  const blob = await pdf(doc).toBlob();
  const filename = `Housekeeping-Audit-${new Date().toISOString().slice(0, 10)}.pdf`;
  saveAs(blob, filename);
}

// ==================================================
// Main PDF Document Component
// ==================================================
function AuditPDFDocument({
  categories,
  inspectedBy,
  date,
  time,
  location,
  department,
}: {
  categories: Category[];
  inspectedBy: string;
  date: string;
  time: string;
  location: string;
  department: string;
}) {
  // Helper: score and action taken
  const getScoreAndAction = (status: AuditItem["status"]) => {
    if (status === "checked") return { score: "1", actionTaken: "Y" };
    if (status === "crossed") return { score: "0", actionTaken: "N" };
    return { score: "", actionTaken: "" };
  };

  // Full timeframe labels
  const timeframeLabels: Record<AuditItem["timeframe"], string> = {
    Immediate: "Immediate (24 hrs)",
    Urgent: "Urgent (5 days)",
    Ongoing: "Ongoing (1 month)",
    Open: "Open",
  };

  let globalItemIndex = 1;
  const allItems = categories.flatMap(c => c.items);
  const totalChecked = allItems.filter(i => i.status === "checked").length;
  const totalItems = allItems.length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={styles.logo} src="/logo.png" />
            <Text style={{ marginLeft: 12, fontSize: 14, fontWeight: "bold" }}>
              Eurohealth Systems
            </Text>
          </View>
          <Text style={styles.title}>HOUSEKEEPING AUDIT CHECKLIST</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text>Base Location: {location || "_________________________"}</Text>
            <Text>Ward/Unit/Department: {department || "_________________________"}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text>Inspected by: {inspectedBy || "_________________________"}</Text>
            <Text>Date: {date}  Time: {time}</Text>
          </View>
        </View>

        {/* Measurable Standard & Keys */}
        <View style={styles.keys}>
          <Text style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: 4 }}>
            Measurable Standard:
          </Text>
          <Text style={{ marginBottom: 8 }}>
            Clean is defined as the area is free of dust, stains, rubbish and wetness, looks tidy, neat, orderly and is spotless.
          </Text>
          <View style={{ flexDirection: "row", gap: 30 }}>
            <View>
              <Text style={{ fontWeight: "bold" }}>KEY:</Text>
              <Text>(Checkmark) Met  (X) Didn't Meet  (-) Pending</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>Action Timeframe:</Text>
              <Text>Immediate (24 hrs) · Urgent (5 days) · Ongoing (1 month) · Open</Text>
            </View>
          </View>
        </View>

        {/* Main Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerCell]} fixed>
            <Text style={[styles.cell, styles.colNum]}>#</Text>
            <Text style={[styles.cell, styles.colElement]}>Elements</Text>
            <Text style={[styles.cell, styles.colComment]}>Comments</Text>
            <Text style={[styles.cell, styles.colOutOf]}>Out of</Text>
            <Text style={[styles.cell, styles.colScore]}>Score</Text>
            <Text style={[styles.cell, styles.colAction]}>Action Timeframe</Text>
            <Text style={[styles.cell, styles.colYN]}>Action Taken Y/N</Text>
          </View>

          {/* Categories and Items */}
          {categories.map((category, catIdx) => {
            const items = category.items;
            if (items.length === 0) return null;

            return (
              <View key={category.idId} wrap={false}>
                {/* Category Header */}
                <View style={[styles.row, styles.categoryHeader]}>
                  <Text style={[styles.cell, styles.colNum]}>{catIdx + 1}</Text>
                  <Text style={[styles.cell, { flex: 1, textAlign: "left", paddingLeft: 8, fontSize: 12 }]}>
                    {category.name.toUpperCase()}
                  </Text>
                </View>

                {/* Items */}
                {items.map((item) => {
                  const { score, actionTaken } = getScoreAndAction(item.status);
                  const timeframeDisplay = timeframeLabels[item.timeframe] || item.timeframe;
                  const currentIndex = globalItemIndex++;

                  return (
                    <View key={item.id} style={styles.row}>
                      <Text style={[styles.cell, styles.colNum]}>{currentIndex}</Text>
                      <Text style={[styles.cell, styles.colElement, { textAlign: "left", paddingLeft: 6 }]}>
                        {item.element}
                      </Text>
                      <Text style={[styles.cell, styles.colComment, { textAlign: "left", paddingLeft: 6 }]}>
                        {item.comments || "-"}
                      </Text>
                      <Text style={[styles.cell, styles.colOutOf]}>1</Text>
                      <Text style={[styles.cell, styles.colScore]}>{score}</Text>
                      <Text style={[styles.cell, styles.colAction, { fontSize: 9.5 }]}>
                        {timeframeDisplay}
                      </Text>
                      <Text style={[styles.cell, styles.colYN]}>{actionTaken}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text>
            Total Score: {totalChecked} / {totalItems} items passed
            {totalItems > 0 && `  (${Math.round((totalChecked / totalItems) * 100)}%)`}
          </Text>
        </View>

        {/* Optional: Signature lines */}
        <View style={{ marginTop: 50, flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text>Auditor Signature: _________________________</Text>
          </View>
          <View>
            <Text>Supervisor Approval: _________________________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}