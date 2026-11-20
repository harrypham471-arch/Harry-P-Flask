from pathlib import Path

from flask import Flask, render_template

HTML_DIR = Path(__file__).resolve().parent.parent / "html"

app = Flask(
    __name__,
    template_folder=str(HTML_DIR),
    static_folder=str(HTML_DIR),
    static_url_path="",
)


@app.route("/")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
