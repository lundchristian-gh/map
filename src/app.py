import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route("/token")
def get_token():
    return flask.send_from_directory("data", "config.json")


@app.route("/whale")
def get_whale():
    return flask.send_from_directory("data", "whale.geojson")


@app.route("/other")
def get_other():
    return flask.send_from_directory("data", "ring.geojson")


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
