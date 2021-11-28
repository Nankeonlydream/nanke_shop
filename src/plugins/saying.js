const sayingList = [
  {headerEN: 'They tried to bury you, remember that you are a seed', bodyCN: '“他们试图把你埋了，你要记得你是种子”', formAu: '---《墨西哥》'},
  {headerEN: 'Any restriction starts from within yourself', bodyCN: '“任何的限制都是从自己内心开始的“', formAu: '---《米歇尔·蒙恩》'},
  {
    headerEN: 'Life is dull at first, but there is wind when you run',
    bodyCN: '“生活原本沉闷，但跑起来就有风“',
    formAu: '---马尔克斯《百年孤独》'
  },
  {headerEN: 'Adversity is a way to the truth', bodyCN: '“逆境是达到真理的一条通路“', formAu: '---《拜伦》'},
  {headerEN: 'Youth is like the praised spring', bodyCN: '“青春，就像受赞美的春天“', formAu: '---《勃特勒》'},
  {headerEN: 'I create, so I survive', bodyCN: '“我创造，所以我生存“', formAu: '---《罗曼·罗兰》'},
  {
    headerEN: 'Patience and persistence are better than fierce fanaticismn',
    bodyCN: '“耐心和持久胜于激烈的狂热“',
    formAu: '---《拉封丹》'
  },
  {
    headerEN: 'Those with loud instrumental voices must be loud, and those with high ambitions must be far-reaching',
    bodyCN: '“器大者声必闳，志高者意必远“',
    formAu: '---《范开》'
  },
  {headerEN: 'Stop fighting and your life will stop', bodyCN: '“停止奋斗，性命也就停止了“', formAu: '---《卡莱尔》'},
  {headerEN: 'All activists are dreamersn', bodyCN: '“一切活动家都是梦想家“', formAu: '---《詹·哈尼克》'},
]

export default function computedTitle() {
  let index = Math.floor(Math.random() * sayingList.length);
  return {
    english: sayingList[index].headerEN,
    chinese: sayingList[index].bodyCN,
    form: sayingList[index].formAu,
  }
}