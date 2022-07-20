"use strict";

module.exports.html2text = async (event) => {
  const { html } = JSON.parse(event.body);

  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html.toString());
  const $ = require("jquery")(dom.window);

  $("html").find("header").remove();
  $("html").find("footer").remove();
  $("html").find("nav").remove();

  const title = $("html").find("title").get()[0].innerHTML;

  const MAX_HEADINGS = 50;
  const headings = Object.fromEntries(
    $("html")
      .find(":header")
      .get()
      .filter((h, i) => i + 1 <= MAX_HEADINGS)
      .map((h, i) => [`h_${i + 1}`, h.innerHTML])
  );
  const content = $("html").get()[0].innerHTML;

  const { convert } = require("html-to-text");
  const text = convert(content, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        text,
        title,
        ...headings,
      },
      null,
      2
    ),
  };
};
