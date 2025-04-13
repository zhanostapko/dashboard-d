"use client";
import { pdf } from "@react-pdf/renderer";
import { Button } from "./ui/button";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export default function GeneratePDFButton() {
  const handleClick = async () => {
    const blob = await pdf(<MyDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      Open PDF
    </Button>
  );
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);
