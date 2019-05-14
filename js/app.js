'use strict';

function Horn(horn) {
  for (let key in horn) {
    this[key] = horn[key];
  }
}

Horn.allHorns = [];
Horn.keywords = [];

Horn.prototype.toHtml = function () {
  let $template = $('#horn-template').html();
  let compiledTemplate = Handlebars.compile($template);
  return compiledTemplate(this);
};

Horn.readJson = ($value) => {
  $.get(`data/${$value}.json`, 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      });
    })
    .then(populateKeywords)
    .then(sortKeywords)
    .then(Horn.loadHorns)
    .then(Horn.loadKeyword);
}

function populateKeywords() {
  Horn.allHorns.forEach(horn => {
    if (!Horn.keywords.includes(horn.keyword)) {
      Horn.keywords.push(horn.keyword)
    }
  })
}

function sortKeywords() {
  Horn.keywords.sort()
}

Horn.loadHorns = () => {
  Horn.allHorns.forEach(horn => {
    $('#horns').append(horn.toHtml())
  });
};

$(() => Horn.readJson($value));
let $value = 'page-1';

Horn.loadKeyword = () => {
  Horn.keywords.forEach((keyword) => {
    $('#filter').append(`<option class="filter-remove" value="${keyword}">${keyword}</option>`);
  })
};

$('#filter').on('change', function () {
  let $selection = $(this).val();
  $('div').hide();
  $(`div[class="${$selection}"]`).show();
});

$('#click').on('change', function() {
  $('.filter-remove').remove();
  $('div').remove();
  let $value = $(this).val();
  Horn.allHorns = [];
  Horn.keywords = [];
  Horn.readJson($value);
});