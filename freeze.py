"""Export the site as static HTML into ./build (for GitHub Pages, Netlify, etc.)."""
from flask_frozen import Freezer

from app import LANGUAGES, app

app.config["FREEZER_DESTINATION"] = "build"
app.config["FREEZER_RELATIVE_URLS"] = True
freezer = Freezer(app)


@freezer.register_generator
def resume():
    for lang in LANGUAGES:
        yield {"lang": lang}


if __name__ == "__main__":
    freezer.freeze()
    print("Static site written to ./build")
