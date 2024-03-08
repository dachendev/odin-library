const myLibrary = [];

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

function addBookToLibrary(title, author, pages, read) { 
    const newBook = new Book(title, author, pages, read);
    newBook.id = crypto.randomUUID();

    // log for debugging
    console.log('new book:', newBook);

    myLibrary.push(newBook);
}

function generateTable(data, columns) {
    const table = document.createElement('table');
    table.classList.add('table');

    // generate header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columns.forEach(({ header }) => {
        const th = document.createElement('th');
        const text = document.createTextNode(header);
        th.appendChild(text);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // generate body
    const tbody = document.createElement('tbody');

    data.forEach(item => {
        const tr = document.createElement('tr');

        columns.forEach(({ accessorKey, renderFn }) => {
            const td = document.createElement('td');

            if (accessorKey) {
                const text = document.createTextNode(item[accessorKey]);
                td.appendChild(text);
            }

            if (accessorKey == null && renderFn) {
                const node = renderFn(item, data);
                td.appendChild(node);
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    return table;
}

function renderTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.replaceChildren();

    const myTable = generateTable(myLibrary, [
        { header: 'Title', accessorKey: 'title' },
        { header: 'Author', accessorKey: 'author' },
        { header: 'Pages', accessorKey: 'pages' },
        {
            header: 'Read', renderFn: function (item) {
                return document.createTextNode(item.read ? 'Yes' : 'No');
            }
        },
        {
            header: 'Actions', renderFn: function (item) {
                const frag = document.createDocumentFragment();

                // mark as read button
                const readBtn = document.createElement('button');
                readBtn.classList.add('btn', 'btn-secondary');
                readBtn.setAttribute('type', 'button');

                const readBtnText = document.createTextNode(item.read ? 'Mark as Unread' : 'Mark as Read');
                readBtn.appendChild(readBtnText);

                readBtn.onclick = function () {
                    // toggle read status
                    const foundIndex = myLibrary.findIndex(x => x.id === item.id);
                    const isRead = myLibrary[foundIndex].read = !myLibrary[foundIndex].read;

                    // update table row
                    this.closest('tr').cells[3].textContent = isRead ? 'Yes' : 'No';

                    // update button text
                    readBtn.textContent = isRead ? 'Mark as Unread' : 'Mark as Read';
                }

                frag.appendChild(readBtn);

                // remove button
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('btn', 'btn-danger');
                removeBtn.setAttribute('type', 'button');

                const removeBtnText = document.createTextNode('Remove');
                removeBtn.appendChild(removeBtnText);

                removeBtn.onclick = function () {
                    // remove from library
                    const foundIndex = myLibrary.findIndex(x => x.id === item.id);
                    myLibrary.splice(foundIndex, 1);

                    // remove from table
                    this.closest('tr').remove();
                }

                frag.appendChild(removeBtn);

                return frag;
            }
        }
    ]);

    tableContainer.appendChild(myTable);
}

window.onload = function () {
    // add event listeners
    const showBtn = document.getElementById('showBtn');
    const newBookDialog = document.getElementById('newBookDialog');
    const cancelBtn = document.getElementById('cancelBtn');

    showBtn.onclick = function () {
        newBookDialog.showModal();
    }

    newBookDialog.querySelector('form').onsubmit = function (ev) {
        ev.preventDefault();
        const form = this;

        // parse values
        const title = form.elements['title'].value;
        const author = form.elements['author'].value;
        const pages = parseInt(form.elements['pages'].value);
        const read = form.elements['read'].checked;

        // add to library and re-render table
        addBookToLibrary(title, author, pages, read);
        renderTable();

        // close dialog
        form.reset();
        newBookDialog.close();
    }

    cancelBtn.onclick = function () {
        newBookDialog.querySelector('form').reset();
        newBookDialog.close();
    }

    // populate library
    addBookToLibrary('The Hobbit 1', 'J.R.R. Tolkein', 295, false);
    addBookToLibrary('The Hobbit 2', 'J.R.R. Tolkein', 295, false);
    addBookToLibrary('The Hobbit 3', 'J.R.R. Tolkein', 295, false);
    renderTable();
}