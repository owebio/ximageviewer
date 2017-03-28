var imageCollection = [
  {title: 'Spanish Dish', url: "../sample/sample_spanish_dish.jpg"},
  {title: 'Cuba', url: "../sample/sample_cuba.jpg"},
  {title: 'Thailand', url: "../sample/sample_thailand.jpg"},
  {title: 'HongKong', url: "../sample/hongkong.jpg"},
  {title: 'Ankor Wat', url: "../sample/sample_cambodia.jpg"},
  {title: 'Seoul', url: "../sample/sample_mask.jpg"},
  {title: 'Casa Milà', url: "../sample/sample_barcelona.jpg"},
  {title: 'La Grande Arche', url: "../sample/sample_paris.jpg"},
  {title: 'Tokyo Metropolitan Government', url: "../sample/sample_tokyo.jpg"},
  {title: 'Friendship', url: "../sample/sample_webtoon.jpg", copyright : "mrlobenstein.com"}
]

var imageItem = imageCollection[Math.floor(Math.random() * imageCollection.length)];
XIV.init(imageItem);

