import './styles/style.css';
import renderTodo from "./modules/render-todo"
export let todoItems = [];

const titleElements = document.querySelectorAll(".grid__item__h3");
for (var i = 0; i < titleElements.length; i++) {
  (function (n) {
    titleElements[n].addEventListener(
      "click",
      function () {
        if (!titleElements[n].classList.contains("grid__item__h3--clickable")) {
          return;
        }
        const indexInEditMode = todoItems.findIndex((el) => {
          return el.editMode === true;
        });
        const deleteElement = todoItems[indexInEditMode];
        const newElement = Object.assign({}, todoItems[indexInEditMode]);
        deleteElement.deleted = true;
        unClickablizeTitle();
        renderTodo(deleteElement);
        todoItems = todoItems.filter((item) => item.id !== deleteElement.id);

        newElement.label = titleElements[n].id;
        newElement.id = Date.now();
        newElement.editMode = false;
        todoItems.push(newElement);
        renderTodo(newElement);
      },
      false
    );
  })(i);
}

function clickablizeTitle(todo) {
  // TODO: refactor here
  const targetId = todo.label;
  let i = 0;
  titleElements.forEach((index) => {
    if (titleElements[i].classList.contains("grid__item__h3--clickable")) {
      titleElements[i].classList.remove("grid__item__h3--clickable");
    }
    if (index.id != targetId) {
      titleElements[i].classList.add("grid__item__h3--clickable");
      i++;
      return;
    }
    i++;
  });
}
// TODO: use arrow
function unClickablizeTitle() {
  let i = 0;
  // TODO: use map
  titleElements.forEach((index) => {
    titleElements[i].classList.remove("grid__item__h3--clickable");
    i++;
  });
  // const elements = document.querySelectorAll(".speech-bubble");
  // Array.prototype.forEach.call(elements, function (element) {
  //   element.remove();
  // });
}



function addTodo(text, label) {
  const todo = {
    text,
    label,
    checked: false,
    editMode: false,
    deleted: false,
    id: Date.now(),
  };
  todoItems.push(todo);
  renderTodo(todo);
}

function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].deleted = true
  const todo = todoItems[index]
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

function toggleEdit(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const otherIndex = todoItems.filter((item) => item.id != Number(key));
  const item = document.querySelector(`[data-key='${todoItems[index].id}']`);
  if (todoItems[index].editMode) {
    const input = item.querySelector("form").querySelector("input");
    let newText = input.value.trim();
    if (newText == "") {
      newText = todoItems[index].text;
    }
    todoItems[index].text = newText;
  }
  todoItems[index].editMode = !todoItems[index].editMode;
  if (todoItems[index].editMode) {
    clickablizeTitle(todoItems[index]);
  } else {
    unClickablizeTitle(todoItems[index]);
  }

  renderTodo(todoItems[index]);
  otherIndex.forEach((el) => {
    el.editMode = false;
    renderTodo(el);
  });
}

const form = document.querySelector(".form--init");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".form--init__input");
  const label = document.querySelector('input[name="due-date"]:checked').value;
  const text = input.value.trim();
  if (text !== "") {
    addTodo(text, label);
    input.value = "";
    input.focus();
  }
});

const priorityButtons = document.querySelectorAll('.fieldset__input')
const focusOnForm = () => {
  document.getElementById("todo-input").focus()
}
// Click should not be used since focus goes to the radio button aftewards
priorityButtons.forEach(el=>{
  el.addEventListener("focus", focusOnForm)
})


const list = document.querySelector(".grid");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("span--round__label")) {
    const itemKey = event.target.parentElement.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains("ul__li--item__btn__span--delete")) {
    const itemKey = event.target.parentElement.parentElement.dataset.key;
    deleteTodo(itemKey);
  }

  if (event.target.classList.contains("ul__li--item__btn__span--edit")) {
    const itemKey = event.target.parentElement.parentElement.dataset.key;
    toggleEdit(itemKey);
  }
});

list.addEventListener("submit", (event) => {
  const itemKey = event.target.parentElement.dataset.key;
  toggleEdit(itemKey);
});

const deleteButton = document.querySelector(".header__h1__a");
deleteButton.addEventListener("click", (event) => {
  // FIX here
  const newToDoItems = todoItems.map(element=>{
    if (!element.checked){return element}
    element.deleted = true
    return element
  })
  todoItems = newToDoItems.filter(element=>{
    if (element.deleted){return false}
    return true
  })
  newToDoItems.forEach(element=>{
    renderTodo(element)
  })
})

document.addEventListener("DOMContentLoaded", () => {
  // localStorage.clear()
  const ref = localStorage.getItem("todoItems");
  if (ref) {
    todoItems = JSON.parse(ref);
    // When refreshed all editMode should be false
    todoItems = todoItems.map((t) => {
      t.editMode = false;
      return t;
    });
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
// localStorage.clear();

// Footer
const year = new Date().getFullYear();
const footer = document.querySelector(".footer");
footer.innerHTML = `Copyright ⓒ ${year} Hoshito Furuno`;
