"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Опционально: можно зарегистрировать кириллический шрифт
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxM.woff2' });

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 10,
  },
  section: {
    marginVertical: 10,
  },
  table: {
    // display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
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
});

export default function InvoicePDFTemplate({ invoice }: { invoice: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>RĒĶINS</Text>
          <Text>Pavadzīmes Nr.: {invoice.number}</Text>
          <Text>Datums: {new Date(invoice.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Pakalpojuma sniedzējs:</Text>
          <Text>SIA "DIMAX"</Text>
          <Text>Reģ.Nr. 40203217287</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Pakalpojuma maksātājs:</Text>
          <Text>{invoice.clientName}</Text>
          <Text>{invoice.clientAddress}</Text>
          <Text>{invoice.clientRegNr}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Transportlīdzekļa:</Text>
          <Text>
            {invoice.carBrand} {invoice.carModel} ({invoice.carPlate})
          </Text>
        </View>

        <View style={[styles.section, styles.table]}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: "40%" }]}>
              Preču/Pakalpojumu nosaukums
            </Text>
            <Text style={[styles.tableCol, { width: "20%" }]}>Mērv.</Text>
            <Text style={[styles.tableCol, { width: "20%" }]}>Daudz.</Text>
            <Text style={[styles.tableCol, { width: "20%" }]}>Summa</Text>
          </View>
          {/* {invoice.items?.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.tableCol, { width: "40%" }]}>
                {item.name}
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                {item.type}
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                {item.total.toFixed(2)}
              </Text>
            </View>
          ))} */}
        </View>

        <View style={styles.section}>
          {/* <Text style={styles.bold}>
            Kopā: {invoice.items?.reduce((s, i) => s + i.total, 0).toFixed(2)}{" "}
            EUR
          </Text> */}
        </View>

        <View style={styles.section}>
          <Text>Izsniedza: _______________________</Text>
          <Text>Saņēma: __________________________</Text>
        </View>
      </Page>
    </Document>
  );
}
