export const orig = `<h1>Original</h1>`

export const p = `<h3><a href="https://ab-test.edgeapp.net/variation-one">Variant One</a> , <a href="https://ab-test.edgeapp.net/variation-two">Variant Two</a></h3>`

export const formOriginal = `<form action="#" method="post" id="signup-form">
  <h2>Sign Up</h2>
    <p>
      <label for="Email" class="floatLabel">Email</label>
      <input id="Email" name="Email" type="text">
    </p>
    <p>
      <label for="password" class="floatLabel">Password</label>
      <input id="password" name="password" type="password">
    </p>
    <p>
      <label for="confirm_password" class="floatLabel">Confirm Password</label>
      <input id="confirm_password" name="confirm_password" type="password">
    </p>
    <p>
      <input type="submit" value="Create My Account">
    </p>
  </form>`

export const styleOriginal = `
body {
  background: #384047;
  font-family: sans-serif;
  font-size: 10px;
}

form {
  background: #fff;
  padding: 4em 4em 2em;
  max-width: 400px;
  margin: 50px auto 0;
  box-shadow: 0 0 1em #222;
  border-radius: 2px;
}
form h2 {
  margin: 0 0 50px 0;
  padding: 10px;
  text-align: center;
  font-size: 30px;
  color: #666666;
  border-bottom: solid 1px #e5e5e5;
}
form p {
  margin: 0 0 3em 0;
  position: relative;
}
form input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  margin: 0;
}
form input[type=text],
form input[type=password] {
  background: #fff;
  border: 1px solid #dbdbdb;
  font-size: 1.6em;
  padding: 0.8em 0.5em;
  border-radius: 2px;
}
form input[type=text]:focus,
form input[type=password]:focus {
  background: #fff;
}
form span {
  display: block;
  background: #F9A5A5;
  padding: 2px 5px;
  color: #666;
}
form input[type=submit] {
  box-shadow: 0 3px 0 0 #e6e6e6;
  border-radius: 2px;
  border: none;
  background-color: green;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 2em;
  line-height: 1.6em;
  margin: 2em 0 0;
  outline: none;
  padding: 0.8em 0;
  text-shadow: 0 1px #68B25B;
}
form input[type=submit]:hover {
  background: #94af65;
  text-shadow: 0 1px 3px #b3b3b3;
}
form label {
  position: absolute;
  left: 8px;
  top: 12px;
  color: #999;
  font-size: 16px;
  display: inline-block;
  padding: 4px 10px;
  font-weight: 400;
  background-color: rgba(255, 255, 255, 0);
}
form label.floatLabel {
  top: -11px;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}`

export const divStyle = `width: 100%`
