import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route("/token")
def get_config():
    return flask.send_from_directory("data", "config.json")


@app.route("/data")
def get_geojson():
    return flask.send_from_directory("data", "data.geojson")


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
