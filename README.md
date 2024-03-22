# Simple Dynamic Server

In this repository we have a *old school* HTTP Server that is capable of generating dynamic content.
This server answer tow URL:
  - /register  => Return a HTML FORM of user registration
  - /result => show the result of the submission made using HTTP GET or HTTP POST

**IMPORTANT**:
  To change the method of submission of the form, you need to pass as parameter to the function getForm the HTTP method desired.