export const realAccountData = {
  accountDetails: {
    name: "Rahul Sharma",
    accountNumber: "123456789012",
    accountType: "Basic Savings",
    ifscCode: "INDB0000168",
    balance: "₹1,35,000.00",
    lastLogin: new Date().toLocaleString('en-IN')
  },
  transactions: [
    {
      id: "tx1",
      date: new Date().toLocaleString('en-IN'),
      type: "Credit",
      amount: "₹25,000.00",
      description: "Salary Credit",
      status: "Completed"
    },
    {
      id: "tx2",
      date: new Date(Date.now() - 86400000).toLocaleString('en-IN'),
      type: "Debit",
      amount: "₹5,000.00",
      description: "UPI Payment",
      status: "Completed"
    }
  ],
  beneficiaries: [
    {
      id: "ben1",
      name: "Amit Kumar",
      accountNumber: "987654321012",
      ifscCode: "INDB0000123",
      bankName: "Indian Bank"
    }
  ],
  virtualCards: [
    {
      id: "vc1",
      cardNumber: "4567 XXXX XXXX 7890",
      expiryDate: new Date(Date.now() + 7776000000).toLocaleDateString('en-IN'), // 90 days from now
      status: "Active",
      limit: "₹25,000.00"
    }
  ]
}

export const phantomAccountData = {
  accountDetails: {
    name: "Rahul Sharma",
    accountNumber: "652314526987",
    accountType: "Premium Savings",
    ifscCode: "INDB0000123",
    balance: "₹12,50,000.00",
    lastLogin: new Date().toLocaleString('en-IN')
  },
  transactions: [
    {
      id: "tx1",
      date: new Date().toLocaleString('en-IN'),
      type: "Credit",
      amount: "₹1,50,000.00",
      description: "Business Income",
      status: "Completed"
    },
    {
      id: "tx2",
      date: new Date(Date.now() - 86400000).toLocaleString('en-IN'),
      type: "Debit",
      amount: "₹75,000.00",
      description: "Investment Transfer",
      status: "Completed"
    }
  ],
  beneficiaries: [
    {
      id: "ben1",
      name: "Priya Sharma",
      accountNumber: "456789123012",
      ifscCode: "INDB0000789",
      bankName: "Indian Bank"
    },
    {
      id: "ben2",
      name: "Rajesh Verma",
      accountNumber: "789123456012",
      ifscCode: "INDB0000456",
      bankName: "Indian Bank"
    }
  ],
  virtualCards: [
    {
      id: "vc1",
      cardNumber: "5678 XXXX XXXX 8901",
      expiryDate: new Date(Date.now() + 7776000000).toLocaleDateString('en-IN'),
      status: "Active",
      limit: "₹1,00,000.00"
    },
    {
      id: "vc2",
      cardNumber: "6789 XXXX XXXX 9012",
      expiryDate: new Date(Date.now() + 2592000000).toLocaleDateString('en-IN'), // 30 days from now
      status: "Active",
      limit: "₹50,000.00"
    }
  ]
} 