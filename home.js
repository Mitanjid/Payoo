// home.js

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const addButton = document.getElementById('add-button');
    const cashOutButton = document.getElementById('cash-out-button');
    const transferButton = document.getElementById('transfer-button');
    const bonusButton = document.getElementById('bonus-button');
    const billButton = document.getElementById('bill-button');
    const transactionsButton = document.getElementById('transactions-button');

    const addMoneyParent = document.getElementById('add-money-parent');
    const cashOutParent = document.getElementById('cash-out-parent');
    const transferMoneyParent = document.getElementById('transfer-money-parent');
    const getBonusParent = document.getElementById('get-bonus-parent');
    const payBillParent = document.getElementById('pay-bill-parent');
    const transactionsParent = document.getElementById('transactions-parent');

    const availableBalanceElement = document.getElementById('available-balance');
    let availableBalance = parseFloat(availableBalanceElement.textContent);

    // Global transactions array
    let transactions = [];

    // Function to show form + highlight active button
    function showForm(formToShow, activeButton) {
        // Hide all forms
        const allForms = [addMoneyParent, cashOutParent, transferMoneyParent, getBonusParent, payBillParent, transactionsParent];
        allForms.forEach(form => form.style.display = 'none');
        formToShow.style.display = 'block';

        // Remove "active" from all buttons
        const allButtons = [addButton, cashOutButton, transferButton, bonusButton, billButton, transactionsButton];
        allButtons.forEach(btn => btn.classList.remove('active'));

        // Highlight the clicked button
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // Navigation buttons
    addButton.addEventListener('click', function() {
        showForm(addMoneyParent, addButton);
    });

    cashOutButton.addEventListener('click', function() {
        showForm(cashOutParent, cashOutButton);
    });

    transferButton.addEventListener('click', function() {
        showForm(transferMoneyParent, transferButton);
    });

    bonusButton.addEventListener('click', function() {
        showForm(getBonusParent, bonusButton);
    });

    billButton.addEventListener('click', function() {
        showForm(payBillParent, billButton);
    });

    transactionsButton.addEventListener('click', function() {
        showForm(transactionsParent, transactionsButton);
        loadTransactions();
    });

    // -------------------------------
    // ADD MONEY FUNCTIONALITY
    // -------------------------------
    const addMoneyBtn = document.getElementById('add-money-btn');
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bank = document.getElementById('bank').value;
            const accountNumber = document.getElementById('account-number').value;
            const amountToAdd = parseFloat(document.getElementById('add-amount').value);
            const pin = document.getElementById('add-pin').value;

            if (!bank || !accountNumber || !amountToAdd || !pin) {
                alert('Please fill in all fields');
                return;
            }
            if (isNaN(amountToAdd) || amountToAdd <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            if (pin.length !== 4 || isNaN(pin)) {
                alert('Pin must be 4 digits');
                return;
            }

            availableBalance += amountToAdd;
            availableBalanceElement.textContent = availableBalance.toFixed(2);

            transactions.push({
                type: 'Deposit',
                amount: amountToAdd,
                date: new Date().toLocaleDateString()
            });

            document.getElementById('bank').value = '';
            document.getElementById('account-number').value = '';
            document.getElementById('add-amount').value = '';
            document.getElementById('add-pin').value = '';

            alert(`Successfully added $${amountToAdd}!`);
        });
    }

    // -------------------------------
    // CASH OUT FUNCTIONALITY
    // -------------------------------
    const withdrawBtn = document.getElementById('withdraw-btn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const agentNumber = document.querySelector('#cash-out-parent input[type="text"]').value;
            const amountToWithdraw = parseFloat(document.getElementById('withdraw-amount').value);
            const pin = document.querySelector('#cash-out-parent input[type="text"]:last-of-type').value;

            if (!agentNumber || !amountToWithdraw || !pin) {
                alert('Please fill in all fields');
                return;
            }
            if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            if (pin.length !== 4 || isNaN(pin)) {
                alert('Pin must be 4 digits');
                return;
            }
            if (amountToWithdraw > availableBalance) {
                alert('Insufficient balance');
                return;
            }

            availableBalance -= amountToWithdraw;
            availableBalanceElement.textContent = availableBalance.toFixed(2);

            transactions.push({
                type: 'Withdrawal',
                amount: amountToWithdraw,
                date: new Date().toLocaleDateString()
            });

            document.querySelector('#cash-out-parent input[type="text"]').value = '';
            document.getElementById('withdraw-amount').value = '';
            document.querySelector('#cash-out-parent input[type="text"]:last-of-type').value = '';

            alert(`Successfully withdrew $${amountToWithdraw}!`);
        });
    }

    // -------------------------------
    // PAY BILL FUNCTIONALITY
    // -------------------------------
    const payBillBtn = document.getElementById('pay-bill-btn');
    if (payBillBtn) {
        payBillBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const billerType = document.getElementById('biller-type').value;
            const amount = parseFloat(document.getElementById('bill-amount').value);
            const accountNumber = document.getElementById('bill-account').value;
            const pin = document.getElementById('bill-pin').value;

            if (!billerType || !amount || !accountNumber || !pin) {
                alert('Please fill in all fields');
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            if (pin.length !== 4 || isNaN(pin)) {
                alert('Pin must be 4 digits');
                return;
            }
            if (amount > availableBalance) {
                alert('Insufficient balance');
                return;
            }

            availableBalance -= amount;
            availableBalanceElement.textContent = availableBalance.toFixed(2);

            transactions.push({
                type: 'Bill Payment',
                amount: amount,
                date: new Date().toLocaleDateString(),
                details: `${billerType} (${accountNumber})`
            });

            document.getElementById('biller-type').value = '';
            document.getElementById('bill-amount').value = '';
            document.getElementById('bill-account').value = '';
            document.getElementById('bill-pin').value = '';

            alert(`Successfully paid $${amount} for ${billerType}!`);
        });
    }

    // -------------------------------
    // GET BONUS FUNCTIONALITY
    // -------------------------------
    const getBonusBtn = document.getElementById('bonus-btn');
    if (getBonusBtn) {
        getBonusBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const promoCode = document.getElementById('promo-code').value;
            const amount = parseFloat(document.getElementById('bonus-amount').value);
            const pin = document.getElementById('bonus-pin').value;

            if (!promoCode || !amount || !pin) {
                alert('Please fill in all fields');
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            if (pin.length !== 4 || isNaN(pin)) {
                alert('Pin must be 4 digits');
                return;
            }

            const validPromos = ['BONUS2024', 'WELCOME10', 'SUMMER25'];
            if (!validPromos.includes(promoCode.toUpperCase())) {
                alert('Invalid promo code');
                return;
            }

            availableBalance += amount;
            availableBalanceElement.textContent = availableBalance.toFixed(2);

            transactions.push({
                type: 'Bonus Received',
                amount: amount,
                date: new Date().toLocaleDateString(),
                details: `Promo: ${promoCode}`
            });

            document.getElementById('promo-code').value = '';
            document.getElementById('bonus-amount').value = '';
            document.getElementById('bonus-pin').value = '';

            alert(`Successfully received $${amount} bonus!`);
        });
    }

    // -------------------------------
    // TRANSFER MONEY FUNCTIONALITY
    // -------------------------------
    const transferBtn = document.getElementById('transfer-btn');
    if (transferBtn) {
        transferBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const recipientAccount = document.getElementById('recipient-account').value;
            const amount = parseFloat(document.getElementById('transfer-amount').value);
            const note = document.getElementById('transfer-note').value;
            const pin = document.getElementById('transfer-pin').value;

            if (!recipientAccount || !amount || !pin) {
                alert('Please fill in all required fields');
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            if (pin.length !== 4 || isNaN(pin)) {
                alert('Pin must be 4 digits');
                return;
            }
            if (amount > availableBalance) {
                alert('Insufficient balance');
                return;
            }

            availableBalance -= amount;
            availableBalanceElement.textContent = availableBalance.toFixed(2);

            transactions.push({
                type: 'Money Transfer',
                amount: amount,
                date: new Date().toLocaleDateString(),
                details: `To: ${recipientAccount}${note ? ' | Note: ' + note : ''}`
            });

            document.getElementById('recipient-account').value = '';
            document.getElementById('transfer-amount').value = '';
            document.getElementById('transfer-note').value = '';
            document.getElementById('transfer-pin').value = '';

            alert(`Successfully transferred $${amount} to ${recipientAccount}!`);
        });
    }

    // -------------------------------
    // LOAD TRANSACTIONS
    // -------------------------------
    function loadTransactions() {
        const transactionContainer = document.getElementById('transaction-container');
        transactionContainer.innerHTML = '';

        transactions.forEach(transaction => {
            const transactionDiv = document.createElement('div');
            transactionDiv.className = 'border-b py-3';
            transactionDiv.innerHTML = `
                <div class="flex justify-between">
                    <span>${transaction.type}</span>
                    <span class="${transaction.type.includes('Withdrawal') || transaction.type.includes('Payment') ? 'text-red-500' : 'text-green-500'}">$${transaction.amount}</span>
                </div>
                <div class="text-sm text-gray-500">${transaction.date}</div>
                ${transaction.details ? `<div class="text-xs text-gray-600">${transaction.details}</div>` : ''}
            `;
            transactionContainer.appendChild(transactionDiv);
        });
    }
});
