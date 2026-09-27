import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function TransactionTable({ data}) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formattedRows = (data || []).map((item, index) => ({
      id: index,
      serialNumber: index + 1,
      ...item,
    }));

    setRows(formattedRows);
  }, [data]);

  const columns = [
    {
      field: "serialNumber",
      headerName: "S.No.",
      width: 80,
      sortable: false,
      filterable: false,
    },
    {
      field: "transaction_date",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "details",
      headerName: "Details",
      flex: 3,
      minWidth: 300,
    },
    {
      field: "debit",
      headerName: "Debit",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "credit",
      headerName: "Credit",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
  ];

  const processRowUpdate = async (updatedRow, originalRow) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/transactions/${updatedRow.transaction_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: updatedRow.tags,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
  
      return updatedRow;
    } catch (error) {
      console.error(error);
      return originalRow;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",

        "& .MuiDataGrid-root": {
          border: "none",
        },

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "action.hover",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 600,
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
      />
    </Box>
  );
}

export default TransactionTable;