import { todoItems } from "../index.js"
import { list } from "../index.js"

export default function renderTodo(todo) {
  console.log("render");
  localStorage.setItem("todoItems", JSON.stringify(todoItems));

  const list = document.querySelector(`.${todo.label}`);
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isCheckedText = todo.checked ? "ul__li--item__text--done" : "";
  const isCheckedMark = todo.checked ? "span--round__label--done" : "";
  const textElement = todo.editMode
    ? `<form class="ul__li--item__form"><input
  autofocus
  type="text"
  aria-label="Enter a new todo item"
  class="ul__li--item__form__input"
/></form>`
    : `<span class="ul__li--item__text ${isCheckedText}">${todo.text}</span>`;

  const node = document.createElement("li");
  node.setAttribute("class", `ul__li--item`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <span class="span--round">
      <input class="span--round__input" type="checkbox" id="${todo.id}" />
      <label class="span--round__label ${isCheckedMark}" for="${todo.id}" />
    </span>
    ${textElement}
    <div class="ul__li--item__btn"><span class="ul__li--item__btn__span--edit material-icons ul__li--item__btn__material-icons" role="button">edit</span></div>
    <div class="ul__li--item__btn"><span class="ul__li--item__btn__span--delete material-icons ul__li--item__btn__material-icons" href="#delete-icon" role="button">delete</span></div>
  `;
  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
  if(todo.editMode){
    const newItem = document.querySelector(`[data-key='${todo.id}']`);
    newItem.querySelector("form").querySelector("input").value = todo.text
    newItem.querySelector("form").querySelector("input").focus()
  }
}