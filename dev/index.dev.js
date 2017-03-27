var imageCollection = [
  {title: 'Cuba', src: "sample/sample_cuba.jpg"},
  {title: 'Thailand', src: "sample/sample_thailand.jpg"},
  {title: 'HongKong', src: "sample/hongkong.jpg"},
  {title: 'Ankor Wat', src: "sample/sample_cambodia.jpg"},
  {title: 'Seoul', src: "sample/sample_mask.jpg"},
  {title: 'Casa Milà', src: "sample/sample_barcelona.jpg"},
  {title: 'La Grande Arche', src: "sample/sample_paris.jpg"},
  {title: 'Tokyo Metropolitan Government', src: "sample/sample_tokyo.jpg"},
  {title: 'Friendship', src: "sample/sample_webtoon.jpg", copy : "MRLOBENSTEIN.COM"}
]

var imageItem = imageCollection[Math.floor(Math.random() * imageCollection.length)];
XIV.init(imageItem);

