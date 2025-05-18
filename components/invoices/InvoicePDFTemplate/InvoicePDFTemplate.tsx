"use client";

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
import Signatures from "./Signatures";
import ItemsTable from "./ItemsTable";
import { InvoiceWithDetails } from "@/types/invoice";
import { format } from "date-fns";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 40,
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
  invoice: InvoiceWithDetails;
};

export default function InvoicePDFTemplate({ invoice }: Props) {
  const {
    number,
    date,
    supplier,
    clientName,
    clientAccount,
    clientBank,
    clientRegNr,
    clientPhone,
    clientBankCode,
    clientAddress,
    clientEmail,
    carBrand,
    carModel,
    carPlate,
    carMileage,
    paymentType,
    items,
    total,
  } = invoice;

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
            <Text>Datums: {`${format(new Date(date), "dd.MM.yyyy")}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pakalpojuma sniedzējs:</Text>
            <Text style={styles.value}>{supplier.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reģ.Nr.:</Text>
            <Text style={styles.value}>{supplier.regNr}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Banka:</Text>
            <Text style={styles.value}>{supplier.bank}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kods:</Text>
            <Text style={styles.value}>{supplier.code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Konts:</Text>
            <Text style={styles.value}>{supplier.account}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tālrunis:</Text>
            <Text style={styles.value}>{supplier.phone}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.label}>Pakalpojuma maksātājs:</Text>
            <Text style={styles.value}>{clientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reģ.Nr.:</Text>
            <Text style={styles.value}>{clientRegNr}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Juridiskā adrese:</Text>
            <Text style={styles.value}>{clientAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Banka:</Text>
            <Text style={styles.value}>{clientBank}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kods:</Text>
            <Text style={styles.value}>{clientBankCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Konts:</Text>
            <Text style={styles.value}>{clientAccount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tālrunis:</Text>
            <Text style={styles.value}>{clientPhone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>E-pasts:</Text>
            <Text style={styles.value}>{clientEmail}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.label}>Transportlīdzekļs</Text>
            <Text
              style={styles.value}
            >{`${carBrand} ${carModel} (${carPlate})`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nobraukums</Text>
            <Text style={styles.value}>{carMileage}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Apmaksas veids:</Text>
          <Text style={styles.value}>
            {paymentType === "NonCash" ? "Pārskaitījums" : "Skaidra nauda"}
          </Text>
        </View>

        <ItemsTable items={items} total={total} />
        <Signatures />
      </Page>
    </Document>
  );
}
