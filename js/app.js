'use strict';
console.log('script loaded');
  
function Horn(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

Horn.allHorns = [];

Horn.prototype.render = function () {
  $('main').append ('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');

  let hornHTML = $('#horn-template').html();

  hornClone.html(hornHTML);

  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('h2').text(this.title);
  hornClone.find('p').text(this.description);
  hornClone.find("div").text(this.keyword);
  hornClone.attr('class', this.keyword);
  hornClone.removeClass('clone');
}

Horn.readJson = () => {
  $.get('data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      });
      Horn.allHorns.forEach(image => {
        $('main').append(image.render());
      });
    })
    .then(Horn.populateFilter)
    .then(Horn.handleFilter);
};
Horn.populateFilter = () => {
  let filterKeywords = [];
  $('option').not(':first').remove();
  Horn.allHorns.forEach(image => {
    if (!filterKeywords.includes(image.keyword))
    filterKeywords.push(image.keyword);
  });
  filterKeywords.sort();
  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}'>${keyword}</option>`;
    $('select').append(optionTag);
  });
};

Horn.loadHorns = () => {
  Horn.allHorns.forEach(horn => horn.render())
}
$('select').on('change', function() {
  let $selection = $(this).val();
  console.log($selection)
  $('div').hide()
  $(`div[class="${$selection}"]`).show()
})

$(() => Horn.readJson());
