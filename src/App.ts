import Handlebars from 'handlebars';

export function render(
  template : string, 
  context : Record<string, unknown> = {},
  rootId : string = 'app') {
  const compiled = Handlebars.compile(template);
  const html = compiled(context);
  const root = document.getElementById(rootId);
  if(root) {
    root.innerHTML = html
  } else {
    console.warn(`Элемент с id "${rootId}" не найден.`);
  }
}[]