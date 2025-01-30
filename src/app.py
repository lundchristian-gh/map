import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route("/config")
def get_config():
    return flask.send_from_directory("data", "config.json")


@app.route("/kvaloya")
def get_kvaloya():
    return flask.send_from_directory("data", "kvaloya.geojson")


@app.route("/ringvassoya")
def get_ringvassoya():
    return flask.send_from_directory("data", "ringvassoya.geojson")


@app.route("/malangen")
def get_malangen():
    return flask.send_from_directory("data", "malangen.geojson")


@app.route("/fastlandet")
def get_fastlandet():
    return flask.send_from_directory("data", "fastlandet.geojson")


@app.route("/worker")
def service_worker():
    response = flask.send_from_directory("static", "service-worker.js")
    response.cache_control.max_age = 3600
    response.cache_control.must_revalidate = True
    return response


@app.route("/")
def index():
    return flask.render_template("index.html")


if __name__ == "__main__":
    # app.run(
    #     host="0.0.0.0",
    #     port=5000,
    #     debug=False,
    # )
    app.run(
        host="127.0.0.1",
        port=8080,
        debug=True,
    )
