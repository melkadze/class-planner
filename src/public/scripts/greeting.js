import { DOMStrings } from "./DOMStrings.js";
const greeting = {
  display() {
    const quotes = [
      "What lies behind you and what lies in front of you, pales in comparison to what lies inside you.",
      "The secret of getting ahead is getting started.",
      "Knowing is not enough; we must apply. Willing is not enough; we must do.",
      "Quality is not an act, it is a habit.",
      "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
      "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
      "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
      "Do the one thing you think you cannot do. Fail at it. Try again. Do better the second time. The only people who never tumble are those who never mount the high wire. This is your moment. Own it.",
      "With the new day comes new strength and new thoughts.",
      "Well done is better than well said.",
      "Good, better, best. Never let it rest. 'Til your good is better and your better is best.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Keep your eyes on the stars, and your feet on the ground.",
      "Accept the challenges so that you can feel the exhilaration of victory.",
      "The harder the conflict, the more glorious the triumph.",
      "If you're going through hell, keep going",
      "Be kind whenever possible. It is always possible.",
      "A good plan violently executed now is better than a perfect plan executed next week.",
      "It always seems impossible until it is done.",
      "Motivation is the art of getting people to do what you want them to do becuase they want to do it.",
    ];
    const authors = [
      "Ralph Waldo Emerson",
      "Mark Twain",
      "Johann Wolfgang Von Goethe",
      "Aristotle",
      "Helen Keller",
      "Confucius",
      "Stephen Hawking",
      "Oprah Winfrey",
      "Eleanor Roosevelt",
      "Benjamin Franklin",
      "Saint Jerome",
      "Confucius",
      "Theodore Roosevelt",
      "George S. Patton",
      "Thomas Paine",
      "Winston Churchill",
      "Dalai Lama",
      "George S. Patton",
      "Nelson Mandela",
      "Dwight D. Eisenhower",
    ];
    const randomChoice = Math.floor(Math.random() * 20);
    const greeting__quote = DOMStrings.greeting__quote;
    const greeting__author = DOMStrings.greeting__author;
    greeting__quote.innerText = `"${quotes[randomChoice]}"`;
    greeting__author.innerText = `${authors[randomChoice]}`;
  },
};
export { greeting };
