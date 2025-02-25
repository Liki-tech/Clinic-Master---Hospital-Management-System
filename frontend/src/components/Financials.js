import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Financials() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    type: 'income',
    category: '',
    amount: 0,
    description: ''
  });
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    type: '',
    category: ''
  });

  const handleAddTransaction = () => {
    setTransactions(prev => [...prev, newTransaction]);
    setNewTransaction({
      date: new Date(),
      type: 'income',
      category: '',
      amount: 0,
      description: ''
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (!filters.startDate || new Date(transaction.date) >= filters.startDate) &&
      (!filters.endDate || new Date(transaction.date) <= filters.endDate) &&
      (!filters.type || transaction.type === filters.type) &&
      (!filters.category || transaction.category === filters.category)
    );
  });

  const incomeCategories = ['Consultation', 'Procedures', 'Medications', 'Other'];
  const expenseCategories = ['Salaries', 'Supplies', 'Rent', 'Utilities', 'Other'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Financial Management
        </Typography>

        {/* Add Transaction */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add Transaction
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="Date"
              value={newTransaction.date}
              onChange={(date) => setNewTransaction(prev => ({ ...prev, date }))}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
                label="Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
            />
            <TextField
              label="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddTransaction}>
              Add
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={handleFilterChange}
                name="type"
                label="Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={handleFilterChange}
                name="category"
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                {[...incomeCategories, ...expenseCategories].map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Transactions Table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Visualizations */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Financial Overview
          </Typography>
          <LineChart
            width={800}
            height={400}
            data={filteredTransactions}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </Box>
      </Paper>
    </Container>
  );
}

export default Financials;
