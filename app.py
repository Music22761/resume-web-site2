from datetime import date
from pathlib import Path

import yaml
from flask import Flask, abort, redirect, render_template, url_for

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
LANGUAGES = {"en": "EN", "th": "TH"}
DEFAULT_LANG = "en"

app = Flask(__name__)


def load_resume(lang: str) -> dict:
    """Read the YAML on every request so content edits show up without a restart."""
    with open(DATA_DIR / f"resume.{lang}.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)


@app.context_processor
def inject_year():
    return {"year": date.today().year}


@app.route("/")
def home():
    return redirect(url_for("resume", lang=DEFAULT_LANG))


@app.route("/<lang>/")
def resume(lang: str):
    if lang not in LANGUAGES:
        abort(404)
    r = load_resume(lang)
    return render_template(
        "index.html",
        r=r,
        lang=lang,
        languages=LANGUAGES,
        tech_count=sum(len(items) for items in r["skills"].values()),
    )


if __name__ == "__main__":
    app.run(debug=True)
