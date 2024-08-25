document.addEventListener('DOMContentLoaded', () => {
    const entryList = document.getElementById('entryList');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const netBalance = document.getElementById('netBalance');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const addEntryButton = document.getElementById('addEntry');

    // Load entries from local storage
    const loadEntries = () => {
        const entries = JSON.parse(localStorage.getItem('entries')) || [];
        return entries;
    };

    const saveEntries = (entries) => {
        localStorage.setItem('entries', JSON.stringify(entries));
    };

    const renderEntries = () => {
        entryList.innerHTML = '';
        const filter = document.querySelector('input[name="filter"]:checked').value;
        const entries = loadEntries();
        let incomeTotal = 0;
        let expenseTotal = 0;

        entries.forEach((entry, index) => {
            if (filter === 'all' || filter === entry.type) {
                const listItem = document.createElement('li');
                listItem.classList.add('mb-2');
                listItem.innerHTML = `
                    <span class="font-bold">${entry.description}:</span>
                    <span class="${entry.type === 'income' ? 'text-green-500' : 'text-red-500'}">
                        $${entry.amount.toFixed(2)}
                    </span>
                    <button class="editEntry text-blue-500 ml-4" data-index="${index}">Edit</button>
                    <button class="deleteEntry text-red-500 ml-2" data-index="${index}">Delete</button>
                `;
                entryList.appendChild(listItem);

                if (entry.type === 'income') {
                    incomeTotal += parseFloat(entry.amount);
                } else {
                    expenseTotal += parseFloat(entry.amount);
                }
            }
        });

        totalIncome.textContent = `$${incomeTotal.toFixed(2)}`;
        totalExpense.textContent = `$${expenseTotal.toFixed(2)}`;
        netBalance.textContent = `$${(incomeTotal - expenseTotal).toFixed(2)}`;
    };

    const addEntry = () => {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const type = amount >= 0 ? 'income' : 'expense';

        if (description && !isNaN(amount)) {
            const entries = loadEntries();
            entries.push({ description, amount: Math.abs(amount), type });
            saveEntries(entries);
            renderEntries();
            descriptionInput.value = '';
            amountInput.value = '';
        }
    };

    const editEntry = (index) => {
        const entries = loadEntries();
        const entry = entries[index];
        descriptionInput.value = entry.description;
        amountInput.value = entry.amount;
        addEntryButton.textContent = 'Update Entry';
        addEntryButton.onclick = () => {
            entries[index] = {
                description: descriptionInput.value.trim(),
                amount: parseFloat(amountInput.value.trim()),
                type: amount >= 0 ? 'income' : 'expense'
            };
            saveEntries(entries);
            renderEntries();
            descriptionInput.value = '';
            amountInput.value = '';
            amountInput.value = '';
            addEntryButton.textContent = 'Add Entry';
            addEntryButton.onclick = addEntry;
        };
    };

    const deleteEntry = (index) => {
        const entries = loadEntries();
        entries.splice(index, 1);
        saveEntries(entries);
        renderEntries();
    };

    entryList.addEventListener('click', (event) => {
        if (event.target.classList.contains('editEntry')) {
            const index = event.target.dataset.index;
            editEntry(index);
        } else if (event.target.classList.contains('deleteEntry')) {
            const index = event.target.dataset.index;
            deleteEntry(index);
        }
    });

    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', renderEntries);
    });

    addEntryButton.addEventListener('click', addEntry);
    renderEntries();
});
