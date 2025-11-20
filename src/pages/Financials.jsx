import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  Calendar,
  IndianRupee,
  Download,
  Filter
} from 'lucide-react';

const Financials = () => {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');

  useEffect(() => {
    const loadTransactions = () => {
      const savedTransactions = localStorage.getItem('TRANSACTIONS');
      console.log('Loading Transactions:', savedTransactions ? 'Found' : 'Not Found');
      
      if (savedTransactions) {
        try {
          const parsed = JSON.parse(savedTransactions);
          console.log('Parsed Transactions:', parsed);
          setTransactions(parsed);
        } catch (error) {
          console.error('Error parsing transactions:', error);
          setTransactions([]);
        }
      } else {
        console.log('No transactions in localStorage');
        setTransactions([]);
      }
    };

    loadTransactions();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'TRANSACTIONS') {
        console.log('Transactions updated!');
        loadTransactions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  // Get unique years
  const years = ['ALL', ...new Set(transactions.map(t => new Date(t.transactionDate).getFullYear()))];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesYear = filterYear === 'ALL' || new Date(transaction.transactionDate).getFullYear().toString() === filterYear;
    return matchesType && matchesYear;
  });

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

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Financial Transparency' : 'आर्थिक पारदर्शकता'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en' 
              ? 'Complete transparency of Gram Panchayat income and expenditure' 
              : 'ग्रामपंचायत उत्पन्न आणि खर्चाची संपूर्ण पारदर्शकता'}
          </p>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Income */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <span className="text-green-700 font-semibold text-sm">
                  {language === 'en' ? 'Total Income' : 'एकूण उत्पन्न'}
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
            <div className="bg-white p-6 rounded-xl border-2 border-red-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
                <span className="text-red-700 font-semibold text-sm">
                  {language === 'en' ? 'Total Expense' : 'एकूण खर्च'}
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
            <div className={`bg-white p-6 rounded-xl border-2 ${stats.balance >= 0 ? 'border-blue-300' : 'border-orange-300'} shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${stats.balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-lg`}>
                  <Wallet className={`${stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} size={24} />
                </div>
                <span className={`${stats.balance >= 0 ? 'text-blue-700' : 'text-orange-700'} font-semibold text-sm`}>
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
            <div className="bg-white p-6 rounded-xl border-2 border-purple-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <span className="text-purple-700 font-semibold text-sm">
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
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              >
                <option value="ALL">{language === 'en' ? 'All Types' : 'सर्व प्रकार'}</option>
                <option value="INCOME">{language === 'en' ? 'Income' : 'उत्पन्न'}</option>
                <option value="EXPENSE">{language === 'en' ? 'Expense' : 'खर्च'}</option>
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year === 'ALL' ? (language === 'en' ? 'All Years' : 'सर्व वर्षे') : year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#138808] to-[#1aa910] text-white px-6 py-4">
              <h2 className="text-2xl font-bold">
                {language === 'en' ? 'Recent Transactions' : 'अलीकडील व्यवहार'}
              </h2>
            </div>

            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'INCOME' ? (
                              <TrendingUp className={`${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`} size={20} />
                            ) : (
                              <TrendingDown className="text-red-600" size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {language === 'en' ? transaction.subcategory : transaction.subcategoryMr}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {language === 'en' ? transaction.description : transaction.descriptionMr}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-gray-500">
                              {language === 'en' ? 'Date' : 'तारीख'}:
                            </span>
                            <div className="flex items-center gap-1 text-gray-700 font-semibold">
                              <Calendar size={14} />
                              {formatDate(transaction.transactionDate)}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-500">
                              {transaction.type === 'INCOME' 
                                ? (language === 'en' ? 'Received From' : 'यांच्याकडून प्राप्त')
                                : (language === 'en' ? 'Paid To' : 'यांना भरलेले')}:
                            </span>
                            <div className="text-gray-700 font-semibold">
                              {transaction.type === 'INCOME'
                                ? (language === 'en' ? transaction.receivedFrom : transaction.receivedFromMr)
                                : (language === 'en' ? transaction.paidTo : transaction.paidToMr)}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-500">
                              {language === 'en' ? 'Payment Mode' : 'पेमेंट मोड'}:
                            </span>
                            <div className="text-gray-700 font-semibold">
                              {transaction.paymentMode.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        {transaction.referenceNumber && (
                          <div className="mt-2 text-xs text-gray-500">
                            {language === 'en' ? 'Ref' : 'संदर्भ'}: {transaction.referenceNumber}
                          </div>
                        )}
                      </div>

                      <div className="ml-6 text-right">
                        <div className={`text-2xl font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </div>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'INCOME' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type === 'INCOME' 
                            ? (language === 'en' ? 'Income' : 'उत्पन्न')
                            : (language === 'en' ? 'Expense' : 'खर्च')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  {language === 'en' 
                    ? 'No transactions available yet' 
                    : 'अद्याप कोणतेही व्यवहार उपलब्ध नाहीत'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {language === 'en' 
                    ? 'Financial data will be displayed here once transactions are added by the admin' 
                    : 'प्रशासकाद्वारे व्यवहार जोडल्यानंतर येथे आर्थिक डेटा प्रदर्शित केला जाईल'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Financials;
