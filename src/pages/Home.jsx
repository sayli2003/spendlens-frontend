import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/transactions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // -----------------------------
  // Calculate analytics
  // -----------------------------

  let totalDebit = 0;
  let totalCredit = 0;

  const categoryTotals = {};

  transactions.forEach((transaction) => {
    const debit = parseFloat(transaction.debit) || 0;
    const credit = parseFloat(transaction.credit) || 0;

    totalDebit += debit;
    totalCredit += credit;

    // Category
    const category = transaction.tags || "Uncategorized";

    categoryTotals[category] = (categoryTotals[category] || 0) + debit;

    // Month
    if (transaction.transaction_date) {
      const date = new Date(transaction.transaction_date);

      const month = date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    }
  });

  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    }),
  );

  const sortedCategoryData = [...categoryData]
    .filter(
      (item) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category),
    )
    .sort((a, b) => b.amount - a.amount);

  const pieTotal = sortedCategoryData.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const SELECT_ALL = "Select all";
  const DESELECT_ALL = "Deselect all";

  const availableCategories = categoryData.map((item) => item.category);

  const categoryOptions = [SELECT_ALL, DESELECT_ALL, ...availableCategories];

  const renderLabel = ({ category, amount }) =>
    `${category}: ₹${amount.toLocaleString("en-IN")}`;

  const monthlyTotals = {};

  transactions.forEach((transaction) => {
    const debit = parseFloat(transaction.debit) || 0;

    if (transaction.transaction_date) {
      const date = new Date(transaction.transaction_date);

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      const label = date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = {
          month: label,
          amount: 0,
          sortKey: key,
        };
      }

      monthlyTotals[key].amount += debit;
    }
  });

  const monthlyData = Object.values(monthlyTotals).sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey),
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Overview of your spending and transactions
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Total Spending */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">Total Spending</Typography>

          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
            ₹
            {totalDebit.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Paper>

        {/* Total Income */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">Total Income</Typography>

          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
            ₹
            {totalCredit.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Paper>

        {/* Spending by Category */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            minHeight: 400,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Spending by Category
          </Typography>

          <Autocomplete
            multiple
            options={categoryOptions}
            value={selectedCategories}
            onChange={(event, newValue) => {
              if (newValue.includes(SELECT_ALL)) {
                setSelectedCategories(availableCategories);
                return;
              }

              if (newValue.includes(DESELECT_ALL)) {
                setSelectedCategories([]);
                return;
              }

              setSelectedCategories(
                newValue.filter(
                  (value) => value !== SELECT_ALL && value !== DESELECT_ALL,
                ),
              );
            }}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  checked={
                    option === SELECT_ALL
                      ? selectedCategories.length === availableCategories.length
                      : option === DESELECT_ALL
                        ? selectedCategories.length === 0
                        : selected
                  }
                  sx={{ mr: 1 }}
                />

                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categories"
                placeholder="Select categories"
                size="small"
              />
            )}
            sx={{ mt: 2, mb: 3 }}
          />

          <Box sx={{ width: "100%", height: 330, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedCategoryData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={120}
                  paddingAngle={0.5}
                  label={renderLabel}
                  labelLine
                >
                  {sortedCategoryData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={
                        [
                          "#6366F1",
                          "#22C55E",
                          "#F59E0B",
                          "#EF4444",
                          "#06B6D4",
                          "#EC4899",
                          "#8B5CF6",
                          "#14B8A6",
                        ][index % 8]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total in centre */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>

              <Typography variant="h6" fontWeight="bold">
                ₹
                {pieTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Spending Over Time */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Spending Over Time
          </Typography>

          <Box sx={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Bar dataKey="amount" name="Spending" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Home;
