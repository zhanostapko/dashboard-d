import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 10,
  },
  block: {
    width: "45%",
  },
  label: {
    marginBottom: 4,
  },
  lineGroup: {
    marginBottom: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingBottom: 2,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  smallText: {
    textAlign: "center",
    fontSize: 8,
  },
  spacing: {
    marginBottom: 12,
  },
});

export default function Signatures() {
  return (
    <View style={styles.container}>
      {/* Issuer */}
      <View style={styles.block}>
        <Text style={styles.label}>Izsniedza:</Text>

        <View style={styles.lineGroup}>
          <Text style={styles.line}>Dmitrijs Sedjuks</Text>
          <Text style={styles.smallText}>vārds, uzvārds</Text>
        </View>

        <View style={styles.lineGroup}>
          <Text style={styles.line}>06.01.2023</Text>
          <Text style={styles.smallText}>datums</Text>
        </View>

        <View style={styles.lineGroup}>
          <Text style={styles.line}> </Text>
          <Text style={styles.smallText}>paraksts</Text>
        </View>
      </View>

      {/* Receiver */}
      <View style={styles.block}>
        <Text style={styles.label}>Saņēma:</Text>

        <View style={styles.lineGroup}>
          <Text style={styles.line}> </Text>
          <Text style={styles.smallText}>vārds, uzvārds</Text>
        </View>

        <View style={styles.lineGroup}>
          <Text style={styles.line}> </Text>
          <Text style={styles.smallText}>datums</Text>
        </View>

        <View style={styles.lineGroup}>
          <Text style={styles.line}> </Text>
          <Text style={styles.smallText}>paraksts</Text>
        </View>
      </View>
    </View>
  );
}
