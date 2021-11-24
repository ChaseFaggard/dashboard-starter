import Database from './database.js'

class ToDoList {

    static render = async element => {
        const records = await Database.getAllRecordsByKey('todo-list', 'email', localStorage.getItem('email'))

        let html = ``
        records.forEach(item => {
            html +=
            `
            <li class="todo-item">
                <div>
                    <input type="checkbox" />
                    <p>${item.todo}</p>
                </div>
                <button class="${item.id}" id="remove-item">x</button>
            </li>
            `
        })

        element.innerHTML =
        `
        <div class="todo-items">${html}</div>
        <div class="todo-add">
            <input 
                id="todo-input"
                type="text"
                placeholder="Add a task. . ."
            />
            <button id="todo-add">+</button>
        </div>
        `

        document.querySelector('#todo-add').addEventListener('click', async e => {
            const input = document.querySelector('#todo-input')
            const record = { todo: input.value, complete: false, email: localStorage.getItem('email') }
            if(record.todo) {
                await Database.createRecord('todo-list', record)
                input.value = ''
                this.render(element)
            }
        })

        const items = document.querySelectorAll('#remove-item')
        for(let item of items) {
            item.addEventListener('click', async e => {
                const id = e.target.classList.value
                await Database.deleteRecordById('todo-list', id)
                this.render(element)
            })
        }
    }

}

export default ToDoList