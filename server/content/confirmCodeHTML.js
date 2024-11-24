export function confirmCodeHTML(code) {
  return `
  <head>
  <style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    background-color: rgba(12, 11, 11, 0.826);
  }
  .container {
    padding-top: 1rem;
    display: grid;
    gap: 2rem;
    color: white;
    background-color: rgb(13, 12, 12);
  }
  .title {
    text-align: center;
    display: grid;
    gap: 0.4rem;
    place-content: center;
  }
  .welcome {
    font-size: 2rem;
  }

  .box {
    display: grid;
    place-content: center;
  }
  .code {
    font-size: 2rem;
    padding: 1rem 2rem;
    text-align: center;
    background-color: #423a3a;
  }
  li {
    list-style: none;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  footer {
    display: grid;
    row-gap: 1rem;
    padding: 1rem 2rem;
  }

  .link {
    color: red;
  }
</style>
</head>
<body>
<div class="container">
  <header class="title">
    <h1 class="welcome">Confirm Code</h1>
    <p class="desc">it's only anvaliable for 5min</p>
  </header>
  <div class="box">
    <p class="code">${code}</p>
  </div>
  <footer>
    <h2 class="sub-title">See as on different media:</h2>
    <ul class="media-list">
      <li class="link">
        <a href="https://red-town.net" target="_blank">Our Site</a>
      </li>
    </ul>
  </footer>
</div>
</body>
  `;
}
