import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 30,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    textAlign: "left",
  },
  signature: {
    marginTop: 50,
    textAlign: "right",
  },
  totalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export const SalesReport = ({ data, period }) => {
  const totalAmount = data.reduce(
    (sum, entry) => sum + Number(entry.totalAmount),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.shopName}>
            Badshah General Store Masakin Branch
          </Text>
          <Text style={styles.title}>Daily Sales Report</Text>
          <Text style={styles.subtitle}>Period: {period}</Text>
          <Text style={styles.subtitle}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "20%" }]}>Date</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>Products</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Payment</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Amount</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>Created At</Text>
          </View>

          {data.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>
                {entry.products.join(", ")}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {entry.paymentType}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                Rs. {Number(entry.totalAmount).toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>Rs. {totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.signature}>
          <Text>Authorized Signature</Text>
          <Text>_________________</Text>
        </View>
      </Page>
    </Document>
  );
};
