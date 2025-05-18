import { InvoiceItem } from "@prisma/client";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

type Props = {
  items: InvoiceItem[];
  total: number;
};
const ItemsTable = ({ items, total }: Props) => {
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.col1]}>
          Preču/Pakalpojumu nosaukums
        </Text>
        <Text style={[styles.cell, styles.col2]}>Mērv.</Text>
        <Text style={[styles.cell, styles.col3]}>Daudz.</Text>
        <Text style={[styles.cell, styles.col4]}>Cena</Text>
        <Text style={[styles.lastCell, styles.col5]}>Summa</Text>
      </View>

      {/* Rows */}
      {items.map((row, i) => (
        <View style={styles.row} key={i}>
          <Text style={[styles.cell, styles.col1]}>{row.name}</Text>
          <Text style={[styles.cell, styles.col2]}>{row.unit}</Text>
          <Text style={[styles.cell, styles.col3]}>{row.quantity}</Text>
          <Text style={[styles.cell, styles.col4]}>{row.price}</Text>
          <Text style={[styles.cell, styles.col5]}>{row.total}</Text>
        </View>
      ))}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Kopā: {`${total} EUR `}</Text>
      </View>
    </View>
  );
};

export default ItemsTable;

const styles = StyleSheet.create({
  table: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
    fontSize: 10,
  },
  lastCell: {
    padding: 4,
    fontSize: 10,
  },
  col1: { width: "40%" },
  col2: { width: "10%" },
  col3: { width: "10%" },
  col4: { width: "20%" },
  col5: { width: "20%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 4,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 10,
  },
});
