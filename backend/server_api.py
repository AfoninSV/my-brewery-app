from flask import Flask, request, render_template



app = Flask(__name__, template_folder="../frontend/build/", static_folder="../frontend/build/static/")

@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/api", methods=["POST"])
def post_data():
    print(type(request.data))
    request.data.json()
    # some_data = {
    #     'user1': 'data1',
    #     'user2': 'data2'
    # }
    return request.data.json()

@app.route("/api", methods=["GET"])
def get_data():
    return {"mydata": "mydata",
            "mydata2": "mydata2"}

if __name__ == "__main__":
    app.run(debug=True)