
const db = require('../db');

exports.createLoan = (req, res) => {
    const { customer_id, principal, years, interest_rate } = req.body;
    if (!customer_id || !principal || !years || !interest_rate) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const interest = principal * years * interest_rate;
    const totalAmount = principal + interest;
    const emi = totalAmount / (years * 12);
    const remainingEmis = years * 12;

    const sql = `INSERT INTO loans (customer_id, principal, interest_rate, years, total_amount, emi_amount, remaining_amount, remaining_emis)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [customer_id, principal, interest_rate, years, totalAmount, emi, totalAmount, remainingEmis], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({
            loan_id: this.lastID,
            total_amount: totalAmount,
            emi_amount: emi
        });
    });
};

exports.makePayment = (req, res) => {
    const { loanId } = req.params;
    const { amount, payment_type } = req.body;

    db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, loan) => {
        if (err || !loan) return res.status(404).json({ error: 'Loan not found' });

        let newRemaining = loan.remaining_amount - amount;
        if (newRemaining < 0) newRemaining = 0;
        let newRemainingEmis = Math.ceil(newRemaining / loan.emi_amount);

        db.run(`UPDATE loans SET remaining_amount = ?, remaining_emis = ? WHERE id = ?`,
            [newRemaining, newRemainingEmis, loanId]);

        db.run(`INSERT INTO payments (loan_id, amount, payment_type, date) VALUES (?, ?, ?, ?)`, 
            [loanId, amount, payment_type, new Date().toISOString()]);

        return res.json({ message: 'Payment successful', remaining_amount: newRemaining, remaining_emis: newRemainingEmis });
    });
};

exports.getLedger = (req, res) => {
    const { loanId } = req.params;

    db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, loan) => {
        if (err || !loan) return res.status(404).json({ error: 'Loan not found' });

        db.all(`SELECT * FROM payments WHERE loan_id = ? ORDER BY date`, [loanId], (err, payments) => {
            if (err) return res.status(500).json({ error: err.message });

            return res.json({
                loan_id: loanId,
                balance_amount: loan.remaining_amount,
                emi_amount: loan.emi_amount,
                remaining_emis: loan.remaining_emis,
                transactions: payments
            });
        });
    });
};

exports.getAccountOverview = (req, res) => {
    const { customerId } = req.params;

    db.all(`SELECT * FROM loans WHERE customer_id = ?`, [customerId], (err, loans) => {
        if (err) return res.status(500).json({ error: err.message });

        const overview = loans.map(loan => {
            const totalInterest = loan.total_amount - loan.principal;
            return {
                loan_id: loan.id,
                principal: loan.principal,
                total_amount: loan.total_amount,
                emi_amount: loan.emi_amount,
                total_interest: totalInterest,
                remaining_amount: loan.remaining_amount,
                remaining_emis: loan.remaining_emis
            };
        });

        return res.json({ customer_id: customerId, loans: overview });
    });
};
