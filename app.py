from flask import Flask, render_template, jsonify
import csv
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_csv(filename):
    data = []
    with open(os.path.join(BASE_DIR, filename), newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def safe_float(v):
    try:
        return float(v)
    except:
        return None

def get_all_data():
    gini = load_csv('gini_2016_2025.csv')
    kemiskinan = load_csv('kemiskinan_2016_2025.csv')
    pengangguran = load_csv('pengangguran_2016_2025.csv')
    merged = {}
    for row in gini:
        key = (row['provinsi'], row['tahun'])
        merged[key] = {'provinsi': row['provinsi'], 'tahun': int(row['tahun']),
                       'gini': safe_float(row['gini_index'])}
    for row in kemiskinan:
        key = (row['provinsi'], row['tahun'])
        v = safe_float(row['index_kemiskinan'])
        if key in merged:
            merged[key]['kemiskinan'] = v
        else:
            merged[key] = {'provinsi': row['provinsi'], 'tahun': int(row['tahun']), 'kemiskinan': v}
    for row in pengangguran:
        key = (row['provinsi'], row['tahun'])
        v = safe_float(row['tingkat_pengangguran'])
        if key in merged:
            merged[key]['pengangguran'] = v
        else:
            merged[key] = {'provinsi': row['provinsi'], 'tahun': int(row['tahun']), 'pengangguran': v}
    return list(merged.values())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def api_data():
    return jsonify(get_all_data())

@app.route('/api/indonesia_trend')
def indonesia_trend():
    data = [d for d in get_all_data() if d['provinsi'] == 'INDONESIA']
    data.sort(key=lambda x: x['tahun'])
    return jsonify(data)

@app.route('/api/provinces_trend')
def provinces_trend():
    data = [d for d in get_all_data() if d['provinsi'] != 'INDONESIA']
    data.sort(key=lambda x: (x['provinsi'], x['tahun']))
    return jsonify(data)

@app.route('/api/scatter')
def scatter():
    return jsonify([d for d in get_all_data() if d['provinsi'] != 'INDONESIA'])

@app.route('/api/ranking/<int:year>')
def ranking(year):
    data = [d for d in get_all_data() if d['tahun'] == year and d['provinsi'] != 'INDONESIA']
    def top5(ind):
        f = [d for d in data if d.get(ind) is not None]
        return sorted(f, key=lambda x: x[ind], reverse=True)[:5]
    return jsonify({'gini': top5('gini'), 'kemiskinan': top5('kemiskinan'), 'pengangguran': top5('pengangguran')})

if __name__ == '__main__':
    app.run(debug=True, port=5000)