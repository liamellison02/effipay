from flask import Flask, jsonify, request
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/v1/example', methods=['GET'])
def example_endpoint():
    return jsonify({'message': 'Example endpoint'}), 200

@app.route('/api/v1/example', methods=['POST'])
def create_example():
    data = request.get_json()
    # some action
    return jsonify({'message': 'Resource created', 'data': data}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
