export function confirmCodeHTML(code) {
  return `
  <head>
    <style>
      .title, .code {
        display: grid;
        gap:1rem;
        place-content: center;
        text-align: center;
      }
      .title h1 {
        font-size:3rem;
      }
      .title p {
        font-size: 1.5ren;
      }
      .code {
        font-size:4rem;
      }
    </style>
  </head>
  <body styles="background-color:lightgreen">
    <div
      class="content">
      <header class="title" style="background-color: plum">
        <h1>Hi! This is your code</h1>
        <p>Only for 5min anvaliable</p>
      </header>
    </div>
    <div class="link">
      <h2>Link to our site!</h2>
      <a href="https://127.0.0.1:5173">Senderson.com</a>
      <p class="code">${code}</p>
    </div>
  </body>
  `;
}
