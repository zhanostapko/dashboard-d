"use client";
import { Invoice } from "@prisma/client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import pdfLogo from "@/public/pdfLogo.png";
import InvoiceSignatures from "./Signatures";
import Signatures from "./Signatures";
import ItemsTable from "./ItemsTable";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
    fontFamily: "Roboto",
  },
  header: {
    paddingTop: 20,

    display: "flex",
    alignItems: "center",
  },
  section: {
    marginVertical: 10,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  container: {
    borderBottom: "2px solid black",
    paddingBottom: 6,
    marginBottom: 6,
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginBottom: 4,
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    fontSize: 10,
    marginBottom: 2,
    width: "100%",
  },
  label: {
    width: "100%",
    maxWidth: 150,
  },
  value: {
    fontWeight: "bold",
  },
});

type Props = {
  invoice: Invoice;
};

export default function InvoicePDFTemplate({ invoice }: Props) {
  console.log(invoice, "in PDF");
  const { number, date } = invoice;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src={{ uri: pdfLogo.src }}
            style={{ width: "50%", height: 100 }}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text>Pavadzīmes Nr.: {number}</Text>
            <Text>Datums: 02.04.2025</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pakalpojuma sniedzējs:</Text>
            <Text style={styles.value}>SIA SAI</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reģ.Nr.:</Text>
            <Text style={styles.value}>00000000000</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Banka:</Text>
            <Text style={styles.value}>A/S ________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kods:</Text>
            <Text style={styles.value}>________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Konts:</Text>
            <Text style={styles.value}>LV______ __________________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tālrunis:</Text>
            <Text style={styles.value}>XXXXXXX ; XXXXXXX</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.label}>Pakalpojuma maksātājs:</Text>
            <Text style={styles.value}>SIA SAI</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reģ.Nr.:</Text>
            <Text style={styles.value}>00000000000</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Juridiskā adrese:</Text>
            <Text style={styles.value}>00000000000</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Banka:</Text>
            <Text style={styles.value}>A/S ________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kods:</Text>
            <Text style={styles.value}>________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Konts:</Text>
            <Text style={styles.value}>LV______ __________________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tālrunis:</Text>
            <Text style={styles.value}>XXXXXXX ; XXXXXXX</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.label}>Transportlīdzekļa reģ. Nr.</Text>
            <Text style={styles.value}>VW BEETLE (JK-913)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nobraukums</Text>
            <Text style={styles.value}>12345544343</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Apmaksas veids:</Text>
          <Text style={styles.value}>Parskaitījums</Text>
        </View>

        <ItemsTable />
        <Signatures />
      </Page>
    </Document>
  );
}
