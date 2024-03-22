import { IncomingMessage, ServerResponse, createServer } from "http"
import url from "url";


function getForm(method:  "GET" | "POST", error = "") {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Registration</title>
    </head>
    <body>
        ${error ? '<h1 style="color:red">' + error + '</h1>' : ""}
        <h1>User Registration</h1>
        <form action="/result" method="${method}">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required><br>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br>
            <label for="confpassword">Confirmation:</label><br>
            <input type="password" id="confpassword" name="confpassword" required><br>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
  `

}

// Create a HTTP server
const server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    // Parse the requested URL path

    if(req.url) {
      const requestUrl = new URL(req.url, `http://${req.headers.host}`);
      const path = requestUrl.pathname

    if (req.method === "GET") {
      if (path === "/register") {
        // Serve user registration form
        const form = getForm("GET")
        // Send registration form to the client
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(form);
        return res.end();
      } else if (path === "/result") {
        // Handle GET request and display the form data
        const queryParams = url.parse(req.url as string, true).query;
        const username: string = queryParams.username
          ? queryParams.username.toString()
          : "";
        const email: string = queryParams.email
          ? queryParams.email.toString()
          : "";
        const password: string = queryParams.password
          ? queryParams.password.toString()
          : "";

        const confPassword: string = queryParams.confpassword
          ? queryParams.confpassword.toString()
          : "";

        res.writeHead(200, { "Content-Type": "text/html" });
        if(confPassword != password) {
          res.write(getForm("GET", "Password and Confirmation should be equals."))
        } else {
          res.write("<h1>Form Submission Result</h1>");
          res.write("<p>Submitted Data:</p>");
          res.write(`<p>Username: ${username}</p>`);
          res.write(`<p>Email: ${email}</p>`);
          res.write(`<p>Password: ${password}</p>`);
          res.write(`<p>Confirmation: ${confPassword}</p>`);
        }
        return res.end();
      } else {
        // Handle unknown URLs
        res.writeHead(404);
        res.end("Page not found");
      }
    } else if (req.method === "POST" && path === "/result") {
      // Handle POST request and display the submitted data
      let formData = "";
      req.on("data", (chunk) => {
        formData += chunk.toString();
      });

      req.on("end", () => {

        const parsedFormData = new URLSearchParams(formData);
        const username = parsedFormData.get("username") || ""
        const email = parsedFormData.get("email") || ""
        const password = parsedFormData.get("password") || ""
        const confPassword = parsedFormData.get("confpassword") || ""

        res.writeHead(200, { "Content-Type": "text/html" });
        if(confPassword != password) {
          res.write(getForm("POST", "Password and Confirmation should be equals."))
        } else {
          res.write("<h1>Form Submission Result</h1>");
          res.write("<p>Submitted Data:</p>");
          res.write(`<p>Username: ${username}</p>`);
          res.write(`<p>Email: ${email}</p>`);
          res.write(`<p>Password: ${password}</p>`);
          res.write(`<p>Confirmation: ${confPassword}</p>`);
        }
        return res.end();
      });
    } else {
      // Handle unknown URLs
      res.writeHead(404);
      res.end("Page not found");
    }
  } else {
    // Handle unknown URLs
    res.writeHead(404);
    res.end("Page not found");
  }
});

// Define the port number for the server to listen on
const PORT = 3000;
// Start the server and listen for incoming requests
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
