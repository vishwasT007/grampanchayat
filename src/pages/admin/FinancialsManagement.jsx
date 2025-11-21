import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  IndianRupee,
  Calendar,
  Filter,
  Download,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllRecords, deleteRecord } from '../../services/financialService';

const FinancialsManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Load transactions from Firebase
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const records = await getAllRecords();
        setTransactions(records);
      } catch (error) {
        console.error('Error loading transactions:', error);
        alert('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  // Calculate statistics
  const stats = {
    totalIncome: transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0),
    balance: 0,
    transactionCount: transactions.length
  };
  stats.balance = stats.totalIncome - stats.totalExpense;

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.descriptionMr.includes(searchTerm) ||
      transaction.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'ALL' || transaction.category === filterCategory;
    
    const matchesDateRange = 
      (!dateRange.start || transaction.transactionDate >= dateRange.start) &&
      (!dateRange.end || transaction.transactionDate <= dateRange.end);

    return matchesSearch && matchesType && matchesCategory && matchesDateRange;
  });

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this transaction?' : 'तुम्हाला खात्री आहे की तुम्ही हा व्यवहार हटवू इच्छिता?')) {
      try {
        await deleteRecord(id);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'INCOME': return 'bg-green-100 text-green-800 border-green-300';
      case 'EXPENSE': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'TAX': return <IndianRupee size={16} />;
      case 'GRANT': return <PiggyBank size={16} />;
      case 'SALARY': return <Wallet size={16} />;
      case 'INFRASTRUCTURE': return <TrendingUp size={16} />;
      case 'UTILITIES': return <TrendingDown size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const exportReport = () => {
    alert(language === 'en' ? 'Export functionality will be implemented' : 'निर्यात कार्यक्षमता लागू केली जाईल');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'en' ? 'Financial Management' : 'आर्थिक व्यवस्थापन'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? 'Track income, expenses, and budgets' 
              : 'उत्पन्न, खर्च आणि अर्थसंकल्प ट्रॅक करा'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#138808] text-[#138808] rounded-lg hover:bg-[#138808] hover:text-white transition-colors"
          >
            <Download size={20} />
            {language === 'en' ? 'Export Report' : 'अहवाल निर्यात करा'}
          </button>
          <Link
            to="/admin/financials/new"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            {language === 'en' ? 'Add Transaction' : 'व्यवहार जोडा'}
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-green-700 font-semibold">
              {language === 'en' ? 'Income' : 'उत्पन्न'}
            </span>
          </div>
          <div className="text-3xl font-bold text-green-800">
            {formatCurrency(stats.totalIncome)}
          </div>
          <div className="text-sm text-green-600 mt-1">
            {transactions.filter(t => t.type === 'INCOME').length} {language === 'en' ? 'transactions' : 'व्यवहार'}
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-300 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-500 rounded-lg">
              <TrendingDown className="text-white" size={24} />
            </div>
            <span className="text-red-700 font-semibold">
              {language === 'en' ? 'Expense' : 'खर्च'}
            </span>
          </div>
          <div className="text-3xl font-bold text-red-800">
            {formatCurrency(stats.totalExpense)}
          </div>
          <div className="text-sm text-red-600 mt-1">
            {transactions.filter(t => t.type === 'EXPENSE').length} {language === 'en' ? 'transactions' : 'व्यवहार'}
          </div>
        </div>

        {/* Balance */}
        <div className={`bg-gradient-to-br ${stats.balance >= 0 ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} p-6 rounded-xl border-2 shadow-md`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`p-3 ${stats.balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-lg`}>
              <Wallet className="text-white" size={24} />
            </div>
            <span className={`${stats.balance >= 0 ? 'text-blue-700' : 'text-orange-700'} font-semibold`}>
              {language === 'en' ? 'Balance' : 'शिल्लक'}
            </span>
          </div>
          <div className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
            {formatCurrency(stats.balance)}
          </div>
          <div className={`text-sm ${stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>
            {stats.balance >= 0 
              ? (language === 'en' ? 'Surplus' : 'अधिशेष')
              : (language === 'en' ? 'Deficit' : 'तूट')}
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-500 rounded-lg">
              <FileText className="text-white" size={24} />
            </div>
            <span className="text-purple-700 font-semibold">
              {language === 'en' ? 'Total' : 'एकूण'}
            </span>
          </div>
          <div className="text-3xl font-bold text-purple-800">
            {stats.transactionCount}
          </div>
          <div className="text-sm text-purple-600 mt-1">
            {language === 'en' ? 'Transactions' : 'व्यवहार'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search transactions...' : 'व्यवहार शोधा...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
            >
              <option value="ALL">{language === 'en' ? 'All Types' : 'सर्व प्रकार'}</option>
              <option value="INCOME">{language === 'en' ? 'Income' : 'उत्पन्न'}</option>
              <option value="EXPENSE">{language === 'en' ? 'Expense' : 'खर्च'}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
            >
              <option value="ALL">{language === 'en' ? 'All Categories' : 'सर्व श्रेणी'}</option>
              <option value="TAX">{language === 'en' ? 'Tax' : 'कर'}</option>
              <option value="GRANT">{language === 'en' ? 'Grant' : 'अनुदान'}</option>
              <option value="SALARY">{language === 'en' ? 'Salary' : 'वेतन'}</option>
              <option value="INFRASTRUCTURE">{language === 'en' ? 'Infrastructure' : 'पायाभूत सुविधा'}</option>
              <option value="UTILITIES">{language === 'en' ? 'Utilities' : 'उपयुक्तता'}</option>
              <option value="OTHER">{language === 'en' ? 'Other' : 'इतर'}</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Date' : 'तारीख'}
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Type' : 'प्रकार'}
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Category' : 'श्रेणी'}
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Description' : 'वर्णन'}
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Party' : 'पक्ष'}
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  {language === 'en' ? 'Amount' : 'रक्कम'}
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  {language === 'en' ? 'Payment Mode' : 'पेमेंट मोड'}
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  {language === 'en' ? 'Actions' : 'क्रिया'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    {language === 'en' 
                      ? 'No transactions found. Add your first transaction!' 
                      : 'कोणतेही व्यवहार आढळले नाहीत. तुमचा पहिला व्यवहार जोडा!'}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(transaction.transactionDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'INCOME' ? (
                          <>
                            <TrendingUp size={14} />
                            {language === 'en' ? 'Income' : 'उत्पन्न'}
                          </>
                        ) : (
                          <>
                            <TrendingDown size={14} />
                            {language === 'en' ? 'Expense' : 'खर्च'}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(transaction.category)}
                        <span className="text-gray-700">
                          {language === 'en' ? transaction.subcategory : transaction.subcategoryMr}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-gray-700 line-clamp-2">
                          {language === 'en' ? transaction.description : transaction.descriptionMr}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.referenceNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        {transaction.type === 'INCOME' 
                          ? (language === 'en' ? transaction.receivedFrom : transaction.receivedFromMr)
                          : (language === 'en' ? transaction.paidTo : transaction.paidToMr)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {transaction.paymentMode.replace('_', ' ')}
                      </span>
                      {transaction.attachment && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                          <FileText size={12} />
                          {language === 'en' ? 'Attachment' : 'संलग्नक'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/financials/edit/${transaction.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={language === 'en' ? 'Edit' : 'संपादित करा'}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'en' ? 'Delete' : 'हटवा'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsManagement;
