'use strict';

function Animal(animal) {
  for (let key in animal) {
    this[key] = animal[key];
  }
}

Animal.allAnimals = [];
Animal.keywords = [];

Animal.prototype.toHtml = function () {
  let $template = $('#animal-template').html();
  let compiledTemplate = Handlebars.compile($template);
  return compiledTemplate(this);
};

Animal.readJson = ($value) => {
  $.get(`data/${$value}.json`, 'json')
    .then(data => {
      data.forEach(item => {
        Animal.allAnimals.push(new Animal(item));
      });
    })
    .then(populateKeywords)
    .then(sortKeywords)
    .then(Animal.loadAnimals)
    .then(Animal.loadKeyword);
}

function populateKeywords() {
  Animal.allAnimals.forEach(animal => {
    if (!Animal.keywords.includes(animal.keyword)) {
      Animal.keywords.push(animal.keyword)
    }
  })
}

function sortKeywords() {
  Animal.keywords.sort()
}

Animal.loadAnimals = () => {
  Animal.allAnimals.forEach(animal => {
    $('#animals').append(animal.toHtml())
  });
};

$(() => Animal.readJson($value));
let $value = 'page-1';

Animal.loadKeyword = () => {
  Animal.keywords.forEach((keyword) => {
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
  Animal.allAnimals = [];
  Animal.keywords = [];
  Animal.readJson($value);
});