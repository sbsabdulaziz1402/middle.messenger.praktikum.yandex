import Handlebars from 'handlebars';

export function render(template, context = {}, rootId = 'app') {
  const compiled = Handlebars.compile(template);
  const html = compiled(context);
  document.getElementById(rootId).innerHTML = html;
}
